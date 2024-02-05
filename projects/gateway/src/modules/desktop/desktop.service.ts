import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cron } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { objectPick } from '@catsjuice/utils'
import { In, IsNull, Not, Repository } from 'typeorm'
import { DesktopQueueStatus, ErrorCode } from 'zjf-types'

import { Desktop } from 'src/entities/desktop'
import { responseError } from 'src/utils/response'

import type { DesktopConfig } from '../../config/_desktop.config'
import { RedisService } from '../redis/redis.service'
import { NotifyService } from '../notify/notify.service'
import type { AssignDesktopParamDto } from './dto/assign-desktop.param.dto'
import type { CreateDesktopBodyDto } from './dto/create-desktop.body.dto'
import { DesktopRequestService } from './desktop-request/desktop-request.service'
import { HyperVService } from './hyper-v/hyper-v.service'

@Injectable()
export class DesktopService {
  private readonly _logger = new Logger(DesktopService.name)
  private _checking = false

  private _desktop: DesktopConfig

  constructor(
    @InjectRepository(Desktop)
    private readonly _desktopRepo: Repository<Desktop>,

    private readonly _redisSrv: RedisService,
    private readonly _notifySrv: NotifyService,
    @Inject(forwardRef(() => DesktopRequestService))
    private readonly _desktopReqSrv: DesktopRequestService,
    private readonly _cfgSrv: ConfigService,
    private readonly _hyperVSrv: HyperVService,
  ) {
    this._desktop = this._cfgSrv.get<DesktopConfig>('desktop')
  }

  // 每小时检查一次即将过期的云桌面
  @Cron('0 0 * * * *')
  public async checkExpiredDesktop() {
    if (this._checking)
      responseError(ErrorCode.DESKTOP_EXPIRE_CHECKING)
    try {
      this._checking = true
      // 必须升序排序
      const aheadList = [1, 7, 30].sort()

      const expiredMap = new Map<string, any>()
      const cacheClient = await this._redisSrv.getClient(RedisType.DESKTOP_EXPIRE_NOTIFY_CACHE)
      const notifiedKeyMap = new Map<string, boolean>()

      for (const ahead of aheadList) {
        const qb = this._desktopRepo.createQueryBuilder('d')
        const dayMs = 1000 * 60 * 60 * 24
        qb.where('userId IS NOT NULL')
        qb.andWhere('d.disabled = :disabled', { disabled: false })
        qb.andWhere('expiredAt > :now', { now: new Date() })
        qb.andWhere('expiredAt < :aheadExpire', { aheadExpire: new Date(Date.now() + dayMs * ahead) })
        qb.leftJoinAndSelect('d.user', 'u')
        qb.leftJoinAndSelect('u.verification', 'v')
        const desktops = await qb.getMany()
        for (const desktop of desktops) {
          const key = `${desktop.id}_${desktop.userId}`
          const aheadKey = `${key}_${ahead}`

          // 只取最近的时间
          if (expiredMap.has(key))
            continue

          // 如果已经通知过了，就不再通知
          if (notifiedKeyMap.get(key) || await cacheClient.get(aheadKey)) {
            notifiedKeyMap.set(key, true)
            continue
          }

          expiredMap.set(key, { desktop, ahead })
          // 设置通知缓存，在 ahead 天内不再重新通知
          await cacheClient.setEx(aheadKey, 60 * 60 * 24 * ahead + 60, '1')
        }
      }

      for (const { desktop, ahead } of expiredMap.values()) {
        // 通知管理员/用户
        this._logger.log(`☁️ 云桌面 [${desktop.id}] 将在 ${ahead} 天后过期`)
        await this._notifySrv.notifyDesktopExpired(desktop)
      }
    }
    catch (e) {
      this._logger.error(e)
    }
    finally {
      this._checking = false
    }
  }

  /**
   * 创建云桌面
   * @param body
   * @returns
   */
  public async createDesktop(body: CreateDesktopBodyDto) {
    const insertRes = await this._desktopRepo.insert({
      ...objectPick(body, [
        'accessUrl', 'account', 'expiredAt', 'id', 'name', 'internalIp', 'password',
      ]),
      expiredAt: body.expiredAt ? new Date(body.expiredAt) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    })
    return insertRes.identifiers[0].id
  }

  /**
   * 分配云桌面
   * @param param
   * @param duration
   */
  public async allocationDesktop(param: AssignDesktopParamDto, duration = 180) {
    const { desktopId, userId } = param
    const [desktopAssigned, userAssigned] = await Promise.all([
      // 确认云桌面是否已被分配
      this._desktopRepo.exist({
        where: { id: desktopId, userId: Not(IsNull()) },
      }),
      // 确认用户是否已分配了其他的云桌面
      this._desktopRepo.exist({
        where: { userId },
      }),
    ])
    if (desktopAssigned)
      responseError(ErrorCode.DESKTOP_ALREADY_ASSIGNED)
    if (userAssigned)
      responseError(ErrorCode.DESKTOP_USER_ASSIGNED_OTHERS)

    await this._desktopRepo.update(
      { id: desktopId, disabled: false },
      {
        userId,
        expiredAt: new Date(Date.now() + duration * 1000 * 60 * 60 * 24),
      },
    )
    await this._desktopReqSrv.repo().update(
      { userId },
      { status: DesktopQueueStatus.USING },
    )
    setTimeout(async () => {
      const desktop = await this._desktopRepo.findOne({
        where: { id: desktopId },
        relations: { user: { verification: true } },
      })
      this._notifySrv.notifyUserDesktopAssigned(desktop)

      // 绑定域用户
      if (
        this._desktop.domainUser && this._desktop.type === 1
        && desktop.account
        && desktop.account === desktop.user?.account
        && desktop.password?.includes('登录密码')
      )
        this._hyperVSrv.bindDesktopAndUser(desktop.id, desktop.user.account)
    })
  }

  /**
   * 通过ip获取使用中的云桌面
   * @param ip
   * @returns
   */
  public findActiveDesktopByIP(ip: string) {
    return this._desktopRepo.findOne({
      where: { internalIp: ip, disabled: false },
    })
  }

  /**
   * 通过 ip 列表匹配对应的云桌面信息，并将其附加到列表中
   * @param list
   * @param ipKey
   * @param desktopKey
   * @returns
   */
  public async appendDesktop<T>(
    list: T[],
    ipKey: keyof T,
    desktopKey = 'desktop',
  ) {
    const ips = Array.from(new Set(list.map(item => item[ipKey])))
    const desktops = await this.repo().find({
      where: { internalIp: In(ips), disabled: false },
    })
    const desktopIpMap = new Map<string, Desktop>()
    desktops.forEach(desktop => desktopIpMap.set(desktop.internalIp, desktop))
    list.forEach(item => item[desktopKey] = desktopIpMap.get(item[ipKey] as string))
    return list
  }

  repo() {
    return this._desktopRepo
  }

  qb(alias = 'd') {
    return this._desktopRepo.createQueryBuilder(alias)
  }
}
