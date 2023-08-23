import { getQuery } from 'src/utils/query'
import type { Desktop } from 'src/entities/desktop'
import { DesktopIdDto } from 'src/dto/id/desktop.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { QueryDto, QueryResDto } from 'src/dto/query.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiSuccessResponse, responseError } from 'src/utils/response'
import { DesktopQueueStatus, ErrorCode, PermissionType } from 'zjf-types'
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common'

import { DesktopService } from './desktop.service'
import { CreateDesktopBodyDto } from './dto/create-desktop.body.dto'
import { UpdateDesktopBodyDto } from './dto/update-desktop.body.dto'
import { AssignDesktopParamDto } from './dto/assign-desktop.param.dto'
import { DesktopRequestService } from './desktop-request/desktop-request.service'

@ApiTags('Desktop | 云桌面')
@Controller('desktop')
export class DesktopController {
  constructor(
    private readonly _desktopSrv: DesktopService,
    private readonly _desktopReqSrv: DesktopRequestService,
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
    return await this._desktopSrv.createDesktop(body)
  }

  @ApiOperation({ summary: '停用一个云桌面' })
  @HasPermission(PermissionType.DESKTOP_DISABLE)
  @Delete(':desktopId')
  public async deleteDesktop(@Param() param: DesktopIdDto) {
    const desktop = await this._desktopSrv.repo().findOne({ where: { id: param.desktopId } })
    if (desktop.disabled)
      return true
    const updateRes = await this._desktopSrv.repo().update(
      { id: param.desktopId },
      { disabled: true, userId: null, lastUserId: desktop.userId },
    )
    return updateRes.affected > 0
  }

  @ApiOperation({ summary: '更新一个云桌面（无法更新一个已禁用的）' })
  @HasPermission(PermissionType.DESKTOP_UPDATE)
  @Patch(':desktopId')
  public async updateDesktop(
    @Param() param: DesktopIdDto,
    @Body() body: UpdateDesktopBodyDto,
  ) {
    const updateRes = await this._desktopSrv.repo().update(
      { id: param.desktopId, disabled: false },
      { ...body },
    )
    return updateRes.affected > 0
  }

  @ApiOperation({ summary: '分配云桌面给指定的用户' })
  @HasPermission(PermissionType.DESKTOP_ASSIGN)
  @Patch(':desktopId/assign/:userId')
  public async assignDesktop(
    @Param() param: AssignDesktopParamDto,
  ) {
    const request = await this._desktopReqSrv.repo().findOne({ where: { userId: param.userId } })
    // 确认是否已是排队状态
    if (request.status !== DesktopQueueStatus.Queueing)
      responseError(ErrorCode.DESKTOP_REQUEST_QUEUE_ONLY)
    // 将云桌面分配，并更新用户的状态
    await this._desktopSrv.repo().update(
      { id: param.desktopId, disabled: false },
      { userId: param.userId },
    )
    await this._desktopReqSrv.repo().update(
      { userId: param.userId },
      { status: DesktopQueueStatus.Using },
    )
    return true
  }

  @ApiOperation({ summary: '查询云桌面列表' })
  @HasPermission(PermissionType.DESKTOP_QUERY)
  @ApiSuccessResponse(QueryResDto<Desktop>)
  @Post('query')
  public async queryDesktop(@Body() body: QueryDto<Desktop>) {
    return await getQuery(this._desktopSrv.repo(), body || {})
  }
}