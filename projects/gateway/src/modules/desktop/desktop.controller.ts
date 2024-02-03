import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common'
import { In } from 'typeorm'
import {
  DESKTOP_MAX_COUNT,
  DesktopQueueHistoryStatus,
  DesktopQueueStatus,
  ErrorCode,
  PermissionType,
  SysConfig,
} from 'zjf-types'

import { Desktop } from 'src/entities/desktop'
import { QueryDto, QueryResDto } from 'src/dto/query.dto'
import { DesktopIdDto } from 'src/dto/id/desktop.dto'
import { IsLogin } from 'src/guards/login.guard'
import { HasPermission } from 'src/guards/permission.guard'
import { getQuery } from 'src/utils/query'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { ApiSuccessResponse, responseError } from 'src/utils/response'

import { NotifyService } from '../notify/notify.service'
import { SysConfigService } from '../config/config.service'
import { DesktopService } from './desktop.service'
import { DesktopResDto } from './dto/desktop.res.dto'
import { CreateDesktopBodyDto } from './dto/create-desktop.body.dto'
import { UpdateDesktopBodyDto } from './dto/update-desktop.body.dto'
import { AssignDesktopParamDto } from './dto/assign-desktop.param.dto'
import { UpdateDesktopFtpQuotaBodyDto } from './dto/update-desktop-ftp-quota.body.dto'
import { DesktopRequestService } from './desktop-request/desktop-request.service'
import { DesktopQueueHistoryService } from './desktop-queue-history/desktop-queue-history.service'
import { ZstackService } from './zstack/zstack.service'

@ApiTags('Desktop | 云桌面')
@Controller('desktop')
export class DesktopController {
  constructor(
    private readonly _notifySrv: NotifyService,
    private readonly _desktopSrv: DesktopService,
    private readonly _desktopReqSrv: DesktopRequestService,
    private readonly _desktopHisSrv: DesktopQueueHistoryService,
    private readonly _zstackSrv: ZstackService,
    private readonly _sysCfgSrv: SysConfigService,
  ) {}

  @ApiOperation({ summary: '判断当前客户端是否在云桌面内使用' })
  @Get('is')
  public async isDesktop(@Req() req: FastifyRequest) {
    const ip = req.raw.ip
    return await this._desktopSrv.repo().exist({ where: { internalIp: ip } })
  }

  @ApiOperation({ summary: '创建一个云桌面' })
  @HasPermission(PermissionType.DESKTOP_CREATE)
  @Put()
  public async createDesktop(@Body() body: CreateDesktopBodyDto) {
    try {
      const sysCfg = await this._sysCfgSrv.getConfig({ version: SysConfig.DESKTOP })
      const { max = DESKTOP_MAX_COUNT } = sysCfg || {}
      const count = await this._desktopSrv.repo().count({
        where: {
          disabled: false,
        },
      })
      if (count >= max)
        responseError(ErrorCode.DESKTOP_RESOURCE_ALLOCATED)
      return await this._desktopSrv.createDesktop(body)
    }
    catch (e) {
      const sqlErr = parseSqlError(e)
      if (sqlErr === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.DESKTOP_ID_EXISTS)
      throw e
    }
  }

  @ApiOperation({ summary: '更新一个云桌面（无法更新一个已禁用的）' })
  @HasPermission(PermissionType.DESKTOP_UPDATE)
  @Patch(':desktopId')
  public async updateDesktop(
    @Param() param: DesktopIdDto,
    @Body() body: UpdateDesktopBodyDto,
  ) {
    const oldDesktop = await this._desktopSrv.repo().findOne({ where: { id: param.desktopId } })
    const updateRes = await this._desktopSrv.repo().update(
      { id: param.desktopId, disabled: false },
      { ...body },
    )
    setTimeout(async () => {
      if (!body.accessUrl && !body.password && !body.account)
        return
      const desktop = await this._desktopSrv.repo().findOne({
        where: { id: param.desktopId },
        relations: { user: { verification: true } },
      })
      let accessUrlUpdated, passwordUpdated, accountUpdated
      if (body.accessUrl && oldDesktop.accessUrl !== body.accessUrl)
        accessUrlUpdated = true
      if (body.password && oldDesktop.password !== body.password)
        passwordUpdated = true
      if (body.account && oldDesktop.account !== body.account)
        accountUpdated = true
      if (!accessUrlUpdated && !passwordUpdated && !accountUpdated)
        return
      this._notifySrv.notifyUserDesktopInfoChanged(desktop)
    })
    return updateRes.affected > 0
  }

  @ApiOperation({ summary: '批量删除云桌面（无法删除未禁用的）' })
  @HasPermission(PermissionType.DESKTOP_DELETE)
  @Delete('delete/batch')
  public async batchDeleteDesktop(@Body() body: DesktopIdDto['desktopId'][]) {
    const deleteRes = await this._desktopSrv.qb()
      .delete()
      .where({ disabled: true })
      .andWhere({ id: In(body) })
      .execute()

    return deleteRes.affected
  }

  @ApiOperation({ summary: '批量停用云桌面' })
  @HasPermission(PermissionType.DESKTOP_DISABLE)
  @Delete('stop/batch')
  public async batchStopDesktop(@Body() body: DesktopIdDto['desktopId'][]) {
    const desktops = await this._desktopSrv.repo().find({
      where: {
        id: In(body),
        disabled: false,
      },
    })
    if (!desktops.length)
      return 0
    const userId = desktops.map(v => v.userId).filter(Boolean)
    if (userId.length) {
      // 将用户的状态更新
      const queues = await this._desktopReqSrv.repo().find({
        where: { userId: In(userId) },
      })
      this._desktopHisSrv.mv2history(
        queues,
        DesktopQueueHistoryStatus.EXPIRED,
        {},
      )
    }

    const updateRes = await this._desktopSrv.qb()
      .update(Desktop)
      .set({
        disabled: true,
        lastUserId: () => 'userId',
        userId: null,
        expiredAt: new Date(),
      })
      .where({ disabled: false })
      .andWhere({ id: In(body) })
      .execute()

    return updateRes.affected
  }

  @ApiOperation({ summary: '分配云桌面给指定的用户' })
  @HasPermission(PermissionType.DESKTOP_ASSIGN)
  @Patch(':desktopId/assign/:userId')
  public async assignDesktop(
    @Param() param: AssignDesktopParamDto,
  ) {
    const request = await this._desktopReqSrv.repo().findOne({ where: { userId: param.userId } })
    // 确认是否已是排队状态
    if (request.status !== DesktopQueueStatus.QUEUEING)
      responseError(ErrorCode.DESKTOP_REQUEST_QUEUE_ONLY)
    // 将云桌面分配，并更新用户的状态
    await this._desktopSrv.allocationDesktop(param, request.duration)
    return true
  }

  @ApiOperation({ summary: '查询云桌面列表' })
  @HasPermission([
    PermissionType.DESKTOP_QUERY,
    PermissionType.DESKTOP_QUERY_ASSIGN,
    PermissionType.DESKTOP_DISABLE_QUERY,
    PermissionType.DESKTOP_FTP_QUERY,
  ])
  @ApiSuccessResponse(QueryResDto<Desktop>)
  @Post('query')
  public async queryDesktop(@Body() body: QueryDto<Desktop>) {
    return await getQuery(this._desktopSrv.repo(), body || {})
  }

  @ApiOperation({ summary: '手动检查云桌面的过期' })
  @HasPermission(PermissionType.DESKTOP_EXPIRE_CHECK)
  @ApiQuery({ name: 'accessKey', description: '操作认证' })
  @Post('check-expire-manually')
  public async checkDesktopExpireManually(@Query('accessKey') accessKey: string) {
    if (accessKey !== 'ZJF-DESKTOP-EXPIRE-CHECK_manually')
      responseError(ErrorCode.PERMISSION_DENIED)
    this._desktopSrv.checkExpiredDesktop()
    return true
  }

  @ApiOperation({ summary: '修改指定云桌面的文件传输配额' })
  @HasPermission(PermissionType.CONFIG_UPSERT_DESKTOP_FTP)
  @Patch('ftp/:desktopId')
  public async updateDesktopFtpQuota(
    @Param() param: DesktopIdDto,
    @Body() body: UpdateDesktopFtpQuotaBodyDto,
  ) {
    const updateRes = await this._desktopSrv.repo().update(
      { id: param.desktopId },
      body,
    )
    return updateRes.affected > 0
  }

  @ApiOperation({ summary: '查询当前用户分配的云桌面的信息' })
  @IsLogin()
  @ApiSuccessResponse(DesktopResDto)
  @Get('own')
  public async getOwnDesktop(@Req() req: FastifyRequest) {
    const user = req.raw.user
    return await this._desktopSrv.repo().findOne({ where: { userId: user.id } })
  }

  @ApiOperation({
    summary: '获取云桌面虚拟机列表',
    description: '返回所有云桌面虚拟机的 id、name、ip',
  })
  @HasPermission(PermissionType.DESKTOP_CREATE)
  @Get('vm-list')
  public async getVMList() {
    return await this._zstackSrv.vmList()
  }
}
