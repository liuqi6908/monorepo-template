import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common'
import {
  DESKTOP_MAX_COUNT,
  DesktopQueueHistoryStatus,
  DesktopQueueStatus,
  ErrorCode,
  PermissionType,
  SysConfig,
} from 'zjf-types'
import { In, IsNull, Not } from 'typeorm'
import type { IGetOwnDesktopReqResData } from 'zjf-types'

import { QueryDto, QueryResDto } from 'src/dto/query.dto'
import { UserIdDto } from 'src/dto/id/user.dto'
import type { DesktopQueue } from 'src/entities/desktop-queue'
import { IsLogin } from 'src/guards/login.guard'
import { HasPermission } from 'src/guards/permission.guard'
import { VerifiedRequired } from 'src/guards/verify-required.guard'
import { getQuery } from 'src/utils/query'
import { ApiSuccessResponse, responseError } from 'src/utils/response'

import { DesktopService } from '../desktop.service'
import { DesktopQueueHistoryService } from '../desktop-queue-history/desktop-queue-history.service'
import { SysConfigService } from '../../config/config.service'
import { DesktopRequestService } from './desktop-request.service'
import { GetOwnDesktopReqResDto } from './dto/get-own-desktop-req.res.dto'
import { BatchRejectDesktopReqBodyDto, RejectDesktopReqBodyDto } from './dto/reject-desktop-req.body.dto'
import { CreateDesktopRequestBodyDto, CreateUserDesktopRequestBodyDto } from './dto/create-desktop-req.body.dto'

@ApiTags('DesktopRequest | 云桌面申请')
@Controller('desktop-request')
export class DesktopRequestController {
  constructor(
    private readonly _desktopSrv: DesktopService,
    private readonly _desktopReqSrv: DesktopRequestService,
    private readonly _desktopReqHistorySrv: DesktopQueueHistoryService,
    private readonly _sysCfgSrv: SysConfigService,
  ) {}

  @ApiOperation({ summary: '发起一个云桌面使用申请' })
  @IsLogin()
  @VerifiedRequired()
  @Put()
  async requestDesktop(
    @Body() body: CreateDesktopRequestBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    return await this._desktopReqSrv.createRequest(user.id, body)
  }

  @ApiOperation({ summary: '创建一个云桌面使用申请' })
  @HasPermission(PermissionType.DESKTOP_REQUEST_CREATE)
  @Put('create')
  async createRequest(
    @Body() body: CreateUserDesktopRequestBodyDto,
  ) {
    return await this._desktopReqSrv.createUserRequest(body.userId, body.duration)
  }

  @ApiOperation({ summary: '通过一个云桌面申请' })
  @HasPermission(PermissionType.DESKTOP_REQUEST_APPROVE)
  @Post('approve/:userId')
  async approveRequest(@Param() param: UserIdDto) {
    return (await this._desktopReqSrv.approveRequest([param.userId])) > 0
  }

  @ApiOperation({ summary: '批量通过云桌面申请' })
  @HasPermission(PermissionType.DESKTOP_REQUEST_APPROVE)
  @Post('approve/batch')
  async batchApproveRequest(@Body() body: UserIdDto['userId'][]) {
    return await this._desktopReqSrv.approveRequest(body)
  }

  @ApiOperation({ summary: '驳回一个云桌面申请' })
  @HasPermission(PermissionType.DESKTOP_REQUEST_REJECT)
  @Post('reject/:userId')
  async rejectRequest(
    @Param() param: UserIdDto,
    @Body() body: RejectDesktopReqBodyDto,
  ) {
    const queue = await this._desktopReqSrv.repo().findOne({
      where: { userId: param.userId },
    })
    if (!queue)
      return false

    if (queue.status !== DesktopQueueStatus.PENDING)
      responseError(ErrorCode.DESKTOP_REQUEST_PENDING_ONLY)

    return (await this._desktopReqHistorySrv.mv2history(
      [queue],
      DesktopQueueHistoryStatus.REJECTED,
      { rejectReason: body.reason },
    )) > 0
  }

  @ApiOperation({ summary: '批量驳回云桌面申请' })
  @HasPermission(PermissionType.DESKTOP_REQUEST_REJECT)
  @Post('reject/batch')
  async batchRejectRequest(@Body() body: BatchRejectDesktopReqBodyDto) {
    const queues = await this._desktopReqSrv.repo().find({
      where: {
        userId: In(body.id),
        status: DesktopQueueStatus.PENDING,
      },
    })

    return (await this._desktopReqHistorySrv.mv2history(
      queues,
      DesktopQueueHistoryStatus.REJECTED,
      { rejectReason: body.reason },
    ))
  }

  @ApiOperation({ summary: '获取当前用户的云桌面使用申请情况' })
  @ApiSuccessResponse(GetOwnDesktopReqResDto)
  @IsLogin()
  @Get('own')
  async getOwnRequest(@Req() req: FastifyRequest) {
    const user = req.raw.user!
    const queue = await this._desktopReqSrv.repo().findOne({ where: { userId: user.id } })
    const queueLength = await this._desktopReqSrv.getLengthAheadOfQueue(queue)
    const lastRejected = queue
      ? null
      : await this._desktopReqHistorySrv.repo().findOne({
        where: { userId: user.id, status: DesktopQueueHistoryStatus.REJECTED },
        order: { createdAt: 'DESC' },
      }) ?? null
    const lastExpired = queue
      ? null
      : await this._desktopSrv.repo().findOne({
        where: { lastUserId: user.id },
        order: { expiredAt: 'DESC' },
      }) ?? null

    const res: IGetOwnDesktopReqResData = { queue, queueLength }
    if (lastRejected && lastExpired) {
      if (lastRejected.createdAt > lastExpired.expiredAt)
        res.lastRejected = lastRejected
      else
        res.lastExpired = lastExpired
    }
    else if (lastRejected) {
      res.lastRejected = lastRejected
    }
    else if (lastExpired) {
      res.lastExpired = lastExpired
    }
    if (queue?.status === DesktopQueueStatus.QUEUEING) {
      const sysCfg = await this._sysCfgSrv.getConfig({ version: SysConfig.DESKTOP })
      const { max = DESKTOP_MAX_COUNT } = sysCfg || {}
      const count = await this._desktopSrv.repo().count({
        where: {
          disabled: false,
          userId: Not(IsNull()),
        },
      })
      res.isResourcesAllocated = count >= max
    }
    return res
  }

  @ApiOperation({ summary: '查询云桌面申请' })
  @HasPermission([
    PermissionType.DESKTOP_REQUEST_QUERY,
    PermissionType.DESKTOP_REQUEST_QUEUEING_QUERY,
  ])
  @ApiSuccessResponse(QueryResDto<DesktopQueue>)
  @Post('query')
  async queryRequests(@Body() body: QueryDto<DesktopQueue>) {
    return await getQuery(
      this._desktopReqSrv.repo(),
      body || {},
    )
  }
}
