import { LessThan, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DesktopQueueStatus, ErrorCode } from 'zjf-types'

import type { User } from 'src/entities/user'
import { responseError } from 'src/utils/response'
import { DesktopQueue } from 'src/entities/desktop-queue'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { NotifyService } from 'src/modules/notify/notify.service'
import type { UserIdDto } from 'src/dto/id/user.dto'
import type { CreateDesktopRequestBodyDto } from './dto/create-desktop-req.body.dto'

@Injectable()
export class DesktopRequestService {
  constructor(
    @InjectRepository(DesktopQueue)
    private readonly _desktopQueueRepo: Repository<DesktopQueue>,
    private readonly _notifySrv: NotifyService,
  ) {}

  /**
   * 创建一个云桌面使用申请
   */
  public async createRequest(
    userId: User['id'],
    info: CreateDesktopRequestBodyDto,
  ) {
    try {
      const insertRes = await this._desktopQueueRepo.insert({
        userId,
        attachments: info.attachments,
        requestAt: new Date(),
        duration: info.duration,
      })
      setTimeout(async () => {
        const queue = await this._desktopQueueRepo.findOne({
          where: { userId },
          relations: { user: { verification: true } },
        })
        if (!queue)
          return
        this._notifySrv.notifyNewDesktopRequest(queue)
      })
      return insertRes.identifiers[0].userId
    }
    catch (e) {
      const sqlErr = parseSqlError(e)
      if (sqlErr === SqlError.DUPLICATE_ENTRY) {
        const desktopQueue = await this._desktopQueueRepo.findOne({
          where: { userId },
        })
        if (desktopQueue) {
          desktopQueue.status === DesktopQueueStatus.PENDING
            ? responseError(ErrorCode.DESKTOP_REQUEST_PENDING_EXISTS)
            : desktopQueue.status === DesktopQueueStatus.QUEUEING
              ? responseError(ErrorCode.DESKTOP_REQUEST_QUEUE_EXISTS)
              : responseError(ErrorCode.DESKTOP_REQUEST_IN_USE_EXISTS)
        }
        responseError(ErrorCode.COMMON_UNEXPECTED_ERROR)
      }
    }
  }

  /**
   * 创建一个云桌面用户使用申请（管理员操作）
   */
  public async createUserRequest(
    userId: User['id'],
    duration: number,
  ) {
    try {
      const insertRes = await this._desktopQueueRepo.insert({
        userId,
        attachments: [],
        requestAt: new Date(),
        queueAt: new Date(),
        status: DesktopQueueStatus.QUEUEING,
        duration,
      })
      return insertRes.identifiers[0].userId
    }
    catch (e) {
      const sqlErr = parseSqlError(e)
      if (sqlErr === SqlError.DUPLICATE_ENTRY) {
        const desktopQueue = await this._desktopQueueRepo.findOne({
          where: { userId },
        })
        if (desktopQueue) {
          desktopQueue.status === DesktopQueueStatus.PENDING
            ? responseError(ErrorCode.DESKTOP_REQUEST_PENDING_EXISTS)
            : desktopQueue.status === DesktopQueueStatus.QUEUEING
              ? responseError(ErrorCode.DESKTOP_REQUEST_QUEUE_EXISTS)
              : responseError(ErrorCode.DESKTOP_REQUEST_IN_USE_EXISTS)
        }
        responseError(ErrorCode.COMMON_UNEXPECTED_ERROR)
      }
      else if (sqlErr === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS) {
        responseError(ErrorCode.USER_NOT_FOUND)
      }
    }
  }

  /**
   * 通过一个云桌面申请
   * @param param
   * @returns
   */
  public async approveRequest(param: UserIdDto) {
    const updateRes = await this._desktopQueueRepo.update(
      { userId: param.userId, status: DesktopQueueStatus.PENDING },
      { status: DesktopQueueStatus.QUEUEING, queueAt: new Date() },
    )
    return updateRes.affected > 0
  }

  /**
   * 获取指定申请前面排队的人数
   * @param queue
   * @returns
   */
  public async getLengthAheadOfQueue(queue?: DesktopQueue) {
    return await this._desktopQueueRepo.count({
      where: {
        status: DesktopQueueStatus.QUEUEING,
        ...(
          queue
            ? { queueAt: LessThan(queue?.queueAt ?? new Date()) }
            : {}
        ),
      },
    })
  }

  repo() {
    return this._desktopQueueRepo
  }

  qb(alias = 'dq') {
    return this._desktopQueueRepo.createQueryBuilder(alias)
  }
}
