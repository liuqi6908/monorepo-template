import { In } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { PermissionType } from 'zjf-types'

import type { DesktopConfig } from 'src/config/_desktop.config'
import { DesktopIdDto } from 'src/dto/id/desktop.dto'
import { VerifiedRequired } from 'src/guards/verify-required.guard'
import { AllowDesktopOperate } from 'src/guards/desktop-operate-allowed.guard'
import { HasPermission } from 'src/guards/permission.guard'
import { DesktopService } from '../../desktop.service'
import { ZstackService } from '../../zstack/zstack.service'
import { HyperVService } from '../../hyper-v/hyper-v.service'

@VerifiedRequired()
@ApiTags('DesktopVm | 云桌面虚拟机')
@Controller('desktop-vm')
export class DesktopVmController {
  private _type: number

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _desktopSrv: DesktopService,
    private readonly _zstackSrv: ZstackService,
    private readonly _hyperVSrv: HyperVService,
  ) {
    this._type = this._cfgSrv.get<DesktopConfig>('desktop').type
  }

  @ApiOperation({ summary: '云桌面总览', description: '返回云主机总数、开机数量、关机数量' })
  @Get()
  public async getVMOverview() {
    if (this._type === 0)
      return await this._zstackSrv.vmOverview()
    else if (this._type === 1)
      return await this._hyperVSrv.vmOverview()
  }

  @ApiOperation({ summary: '获取指定虚拟机的状态' })
  @AllowDesktopOperate()
  @ApiParam({ name: 'desktopId', description: '虚拟机ID' })
  @Get(':desktopId')
  public async getVMState(@Param() param: DesktopIdDto) {
    if (this._type === 0)
      return await this._zstackSrv.getVMState(param.desktopId)
    else if (this._type === 1)
      return await this._hyperVSrv.getVMState(param.desktopId)
  }

  @ApiOperation({ summary: '获取指定虚拟机的详情' })
  @AllowDesktopOperate()
  @ApiParam({ name: 'desktopId', description: '虚拟机ID' })
  @Get('detail/:desktopId')
  public async getVMDetail(@Param() param: DesktopIdDto) {
    if (this._type === 0)
      return await this._zstackSrv.getVMStateDetail(param.desktopId)
    else if (this._type === 1)
      return await this._hyperVSrv.getVMStateDetail(param.desktopId)
  }

  @ApiOperation({ summary: '开机指定的虚拟机' })
  @AllowDesktopOperate()
  @Post('boot/:desktopId')
  public async startVM(@Param() param: DesktopIdDto) {
    if (this._type === 0)
      return await this._zstackSrv.startVM(param.desktopId)
    else if (this._type === 1)
      return await this._hyperVSrv.operateVM(param.desktopId, 'start')
  }

  @ApiOperation({ summary: '批量开机虚拟机' })
  @HasPermission(PermissionType.DESKTOP_ON_OFF)
  @Post('batch/boot')
  public async batchStartVM(@Body() body: DesktopIdDto['desktopId'][]) {
    const desktops = await this._desktopSrv.repo().find({ where: { id: In(body) } })
    desktops.forEach(async (desktop) => {
      try {
        await this.startVM({ desktopId: desktop.id })
      }
      catch (_) {}
    })
    return desktops.length
  }

  @ApiOperation({ summary: '关机指定的虚拟机' })
  @AllowDesktopOperate()
  @Post('shutdown/:desktopId')
  public async stopVM(@Param() param: DesktopIdDto) {
    if (this._type === 0)
      return await this._zstackSrv.stopVM(param.desktopId)
    else if (this._type === 1)
      return await this._hyperVSrv.operateVM(param.desktopId, 'stop')
  }

  @ApiOperation({ summary: '批量关机虚拟机' })
  @HasPermission(PermissionType.DESKTOP_ON_OFF)
  @Post('batch/shutdown')
  public async batchStopVM(@Body() body: DesktopIdDto['desktopId'][]) {
    const desktops = await this._desktopSrv.repo().find({ where: { id: In(body) } })
    desktops.forEach(async (desktop) => {
      try {
        await this.stopVM({ desktopId: desktop.id })
      }
      catch (_) { }
    })
    return desktops.length
  }

  @ApiOperation({ summary: '重启指定的虚拟机' })
  @AllowDesktopOperate()
  @Post('reboot/:desktopId')
  public async rebootVM(@Param() param: DesktopIdDto) {
    if (this._type === 0)
      return await this._zstackSrv.rebootVM(param.desktopId)
    else if (this._type === 1)
      return await this._hyperVSrv.operateVM(param.desktopId, 'reboot')
  }

  @ApiOperation({ summary: '批量重启虚拟机' })
  @HasPermission(PermissionType.DESKTOP_ON_OFF)
  @Post('batch/reboot')
  public async batchRebootVM(@Body() body: DesktopIdDto['desktopId'][]) {
    const desktops = await this._desktopSrv.repo().find({ where: { id: In(body) } })
    desktops.forEach(async (desktop) => {
      try {
        await this.rebootVM({ desktopId: desktop.id })
      }
      catch (_) { }
    })
    return desktops.length
  }
}
