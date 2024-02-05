import { In } from 'typeorm'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { PermissionType } from 'zjf-types'

import { DesktopIdDto } from 'src/dto/id/desktop.dto'
import { VerifiedRequired } from 'src/guards/verify-required.guard'
import { AllowDesktopOperate } from 'src/guards/desktop-operate-allowed.guard'
import { HasPermission } from 'src/guards/permission.guard'
import { DesktopService } from '../../desktop.service'
import { ZstackService } from '../../zstack/zstack.service'

@VerifiedRequired()
@ApiTags('DesktopVm | 云桌面虚拟机')
@Controller('desktop-vm')
export class DesktopVmController {
  constructor(
    private readonly _desktopSrv: DesktopService,
    private readonly _zstackSrv: ZstackService,
  ) {}

  @ApiOperation({ summary: '云桌面总览', description: '返回云主机总数、开机数量、关机数量' })
  @Get()
  public async getVMOverview() {
    return await this._zstackSrv.vmOverview()
  }

  @ApiOperation({ summary: '获取指定虚拟机的状态' })
  @AllowDesktopOperate()
  @ApiParam({ name: 'desktopId', description: '虚拟机ID' })
  @Get(':desktopId')
  public async getVMState(@Param() param: DesktopIdDto) {
    return await this._zstackSrv.getVMState(param.desktopId)
  }

  @ApiOperation({ summary: '获取指定虚拟机的详情' })
  @AllowDesktopOperate()
  @ApiParam({ name: 'desktopId', description: '虚拟机ID' })
  @Get('detail/:desktopId')
  public async getVMDetail(@Param() param: DesktopIdDto) {
    return await this._zstackSrv.getVMStateDetail(param.desktopId)
  }

  @ApiOperation({ summary: '开机指定的虚拟机' })
  @AllowDesktopOperate()
  @Post('boot/:desktopId')
  public async startVM(@Param() param: DesktopIdDto) {
    return await this._zstackSrv.startVM(param.desktopId)
  }

  @ApiOperation({ summary: '批量开机虚拟机' })
  @HasPermission(PermissionType.DESKTOP_ON_OFF)
  @Post('batch/boot')
  public async batchStartVM(@Body() body: DesktopIdDto['desktopId'][]) {
    const desktops = await this._desktopSrv.repo().find({ where: { id: In(body) } })
    for (const desktop of desktops)
      this.startVM({ desktopId: desktop.id })
    return desktops.length
  }

  @ApiOperation({ summary: '关机指定的虚拟机' })
  @AllowDesktopOperate()
  @Post('shutdown/:desktopId')
  public async stopVM(@Param() param: DesktopIdDto) {
    return await this._zstackSrv.stopVM(param.desktopId)
  }

  @ApiOperation({ summary: '批量关机虚拟机' })
  @HasPermission(PermissionType.DESKTOP_ON_OFF)
  @Post('batch/shutdown')
  public async batchStopVM(@Body() body: DesktopIdDto['desktopId'][]) {
    const desktops = await this._desktopSrv.repo().find({ where: { id: In(body) } })
    for (const desktop of desktops)
      this.stopVM({ desktopId: desktop.id })
    return desktops.length
  }

  @ApiOperation({ summary: '重启指定的虚拟机' })
  @AllowDesktopOperate()
  @Post('reboot/:desktopId')
  public async rebootVM(@Param() param: DesktopIdDto) {
    return await this._zstackSrv.rebootVM(param.desktopId)
  }

  @ApiOperation({ summary: '批量重启虚拟机' })
  @HasPermission(PermissionType.DESKTOP_ON_OFF)
  @Post('batch/reboot')
  public async batchRebootVM(@Body() body: DesktopIdDto['desktopId'][]) {
    const desktops = await this._desktopSrv.repo().find({ where: { id: In(body) } })
    for (const desktop of desktops)
      this.rebootVM({ desktopId: desktop.id })
    return desktops.length
  }
}
