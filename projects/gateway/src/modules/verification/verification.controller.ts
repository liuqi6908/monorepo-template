import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Req, forwardRef } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { In } from 'typeorm'
import { ErrorCode, PermissionType, VerificationStatus } from 'zjf-types'

import type { VerificationHistory } from 'src/entities/verification'
import { getQuery } from 'src/utils/query'
import { IsLogin } from 'src/guards/login.guard'
import { HasPermission } from 'src/guards/permission.guard'
import { VerificationIdDto } from 'src/dto/id/verification.dto'
import { VerificationExists } from 'src/guards/verification-exists.guard'
import { ApiErrorResponse, ApiSuccessResponse, responseError } from 'src/utils/response'

import { QueryDto, QueryResDto } from '../../dto/query.dto'
import { NotifyService } from '../notify/notify.service'
import { UserService } from '../user/user.service'
import { DataPermissionService } from '../data/data-permission/data-permission.service'
import { VerificationService } from './verification.service'
import { VerificationResDto } from './dto/verification.res.dto'
import { CreateVerificationBodyDto } from './dto/create-verification.body.dto'
import { BatchRejectVerificationBodyDto, RejectVerificationBodyDto } from './dto/reject-verification.body.dto'

@ApiTags('Verification | 身份审核')
@Controller('verification')
export class VerificationController {
  constructor(
    private readonly _verificationSrv: VerificationService,
    private readonly _notifySrv: NotifyService,
    @Inject(forwardRef(() => UserService))
    private readonly _userSrv: UserService,
    private readonly _dataPerSrc: DataPermissionService,
  ) {}

  @ApiOperation({ summary: '发起一个认证申请' })
  @ApiSuccessResponse(VerificationResDto)
  @ApiErrorResponse(ErrorCode.VERIFICATION_PENDING_EXISTS, ErrorCode.VERIFICATION_NOT_PENDING)
  @IsLogin()
  @Put()
  public async createVerification(
    @Body() body: CreateVerificationBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user
    if (user.verificationId)
      responseError(ErrorCode.VERIFICATION_NOT_PENDING)
    const res = await this._verificationSrv.createVerification(user, body)
    this._notifySrv.notifyNewVerification(res)
    return res
  }

  @ApiOperation({ summary: '获取最近一次的申请认证记录' })
  @ApiSuccessResponse(VerificationResDto)
  @IsLogin()
  @Get('latest')
  public async getLatestVerification(@Req() req: FastifyRequest) {
    const user = req.raw.user
    return this._verificationSrv.getLatestVerificationByFounderId(user.id)
  }

  @ApiOperation({ summary: '查询所有用户的认证申请' })
  @ApiSuccessResponse(QueryResDto)
  @HasPermission(PermissionType.VERIFICATION_LIST_ALL)
  @Post('query')
  public async queryAllVerifications(
    @Body() body: QueryDto<VerificationHistory>,
  ) {
    return await getQuery(
      this._verificationSrv.repo(),
      body,
    )
  }

  @ApiOperation({ summary: '取消一个认证申请' })
  @ApiSuccessResponse(VerificationResDto)
  @HasPermission()
  @ApiErrorResponse(ErrorCode.PERMISSION_DENIED)
  @VerificationExists()
  @IsLogin()
  @Delete('cancel/:verificationId')
  public async cancelVerification(
    @Param() _: VerificationIdDto,
    @Req() req: FastifyRequest,
  ) {
    const verification = req.verificationExistsGuardVerification!
    const user = req.raw.user
    const permissions = user?.role?.permissions || []

    // 取消自己的申请，或者是管理员取消
    if (
      verification.founderId !== req.raw.user!.id
      && !permissions.some(p => p.name === PermissionType.VERIFICATION_CANCEL)
    )
      responseError(ErrorCode.PERMISSION_DENIED)

    return this._verificationSrv.updateVerificationStatus(
      req.verificationExistsGuardVerification!,
      user,
      VerificationStatus.CANCELLED,
    )
  }

  @ApiOperation({ summary: '批量取消用户认证申请（只能取消状态为已通过的）' })
  @HasPermission(PermissionType.VERIFICATION_CANCEL)
  @Delete('cancel/batch')
  public async batchCancelVerification(
    @Req() req: FastifyRequest,
    @Body() body: VerificationIdDto['verificationId'][],
  ) {
    const user = req.raw.user!

    const updateRes = await this._verificationSrv.qb()
      .update(
        {
          status: VerificationStatus.CANCELLED,
          handlerId: user.id,
          handledAt: new Date(),
        },
      )
      .where({ status: VerificationStatus.APPROVED })
      .andWhere({ id: In(body) })
      .execute()

    if (updateRes.affected) {
      await this._userSrv.qb()
        .update(
          { verificationId: null },
        )
        .where({ verificationId: In(body) })
        .execute()
    }
    return updateRes.affected
  }

  @ApiOperation({ summary: '通过一个认证申请' })
  @ApiErrorResponse(ErrorCode.VERIFICATION_NOT_PENDING)
  @VerificationExists()
  @HasPermission(PermissionType.VERIFICATION_APPROVE)
  @Patch('approve/:verificationId')
  public async approveVerification(
    @Param() _: VerificationIdDto,
    @Req() req: FastifyRequest,
  ) {
    const verification = req.verificationExistsGuardVerification!
    const user = req.raw.user!
    if (verification.status !== VerificationStatus.PENDING)
      responseError(ErrorCode.VERIFICATION_NOT_PENDING)
    const res = await this._verificationSrv.updateVerificationStatus(
      verification,
      user,
      VerificationStatus.APPROVED,
    )
    // 自动为用户分配数据角色
    try {
      const dataRole = await this._dataPerSrc.repo().findOne({ where: { name: verification.dataRole } })
      this._userSrv.repo().update({ id: verification.founderId }, { dataRoleId: dataRole?.id })
    }
    catch (_) {}
    return res
  }

  @ApiOperation({ summary: '批量通过用户认证申请（只能通过状态为待审核的）' })
  @HasPermission(PermissionType.VERIFICATION_APPROVE)
  @Patch('approve/batch')
  public async batchApproveVerification(
    @Req() req: FastifyRequest,
    @Body() body: VerificationIdDto['verificationId'][],
  ) {
    const user = req.raw.user!
    const date = new Date().toString()
    const updateRes = await this._verificationSrv.qb()
      .update(
        {
          status: VerificationStatus.APPROVED,
          handlerId: user.id,
          handledAt: new Date(date),
        },
      )
      .where({ status: VerificationStatus.PENDING })
      .andWhere({ id: In(body) })
      .execute()

    if (updateRes.affected) {
      const verifications = await this._verificationSrv.repo()
        .find({
          where: {
            status: VerificationStatus.APPROVED,
            handlerId: user.id,
            handledAt: new Date(date),
          },
        })
      if (verifications.length) {
        const dataRoles = await this._dataPerSrc.repo().find()
        verifications.forEach(async (verification) => {
          const { id, founderId, dataRole } = verification
          await this._userSrv.repo()
            .update(
              {
                id: founderId,
              },
              {
                verificationId: id,
                dataRoleId: dataRoles.find(v => v.name === dataRole)?.id,
              },
            )
          this._notifySrv.notifyVerificationStatusChanged(verification)
        })
      }
    }
    return updateRes.affected
  }

  @ApiOperation({ summary: '驳回一个认证申请' })
  @ApiErrorResponse(ErrorCode.VERIFICATION_NOT_PENDING, ErrorCode.VERIFICATION_REJECT_REASON_REQUIRED)
  @VerificationExists()
  @HasPermission(PermissionType.VERIFICATION_REJECT)
  @Patch('reject/:verificationId')
  public async rejectVerification(
    @Param() _: VerificationIdDto,
    @Req() req: FastifyRequest,
    @Body() body: RejectVerificationBodyDto,
  ) {
    const verification = req.verificationExistsGuardVerification!
    const user = req.raw.user!
    if (verification.status !== VerificationStatus.PENDING)
      responseError(ErrorCode.VERIFICATION_NOT_PENDING)
    return await this._verificationSrv.updateVerificationStatus(
      verification,
      user,
      VerificationStatus.REJECTED,
      body.reason,
    )
  }

  @ApiOperation({ summary: '批量驳回用户认证申请（只能驳回状态为待审核的）' })
  @HasPermission(PermissionType.VERIFICATION_REJECT)
  @Patch('reject/batch')
  public async batchRejectVerification(
    @Req() req: FastifyRequest,
    @Body() body: BatchRejectVerificationBodyDto,
  ) {
    const user = req.raw.user!
    const date = new Date().toString()
    const updateRes = await this._verificationSrv.qb()
      .update(
        {
          status: VerificationStatus.REJECTED,
          rejectReason: body.reason,
          handlerId: user.id,
          handledAt: new Date(date),
        },
      )
      .where({ status: VerificationStatus.PENDING })
      .andWhere({ id: In(body.id) })
      .execute()

    if (updateRes.affected) {
      const verifications = await this._verificationSrv.repo()
        .find({
          where: {
            status: VerificationStatus.REJECTED,
            handlerId: user.id,
            handledAt: new Date(date),
          },
        })
      if (verifications.length) {
        verifications.forEach((verification) => {
          this._notifySrv.notifyVerificationStatusChanged(verification)
        })
      }
    }
    return updateRes.affected
  }
}
