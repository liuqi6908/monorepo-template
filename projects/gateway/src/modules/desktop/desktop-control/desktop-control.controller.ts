import { ErrorCode } from 'zjf-types'
import { responseError } from 'src/utils/response'
import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ZstackService } from '../zstack/zstack.service'

@ApiTags('DesktopControl | 云桌面控制/管理')
@Controller('desktop-control')
export class DesktopControlController {
  constructor(
    private readonly _zstackSrv: ZstackService,
  ) {}

  @ApiOperation({ summary: '获取虚拟机状态' })
  @ApiParam({ name: 'id', description: '虚拟机ID' })
  @Get('vm/state/:id')
  public async getVMState(@Param('id') id: string) {
    return await this._zstackSrv.getVMState(id)
  }

  @ApiOperation({ summary: '开机指定的虚拟机' })
  @ApiParam({ name: 'id', description: '虚拟机ID' })
  @Get('vm/start/:id')
  public async startVM(@Param('id') id: string) {
    responseError(ErrorCode.COMMON_NOT_IMPLEMENTED)
  }

  @ApiOperation({ summary: '关机指定的虚拟机' })
  @ApiParam({ name: 'id', description: '虚拟机ID' })
  @Get('vm/stop/:id')
  public async stopVM(@Param('id') id: string) {
    responseError(ErrorCode.COMMON_NOT_IMPLEMENTED)
  }

  @ApiOperation({ summary: '重启指定的虚拟机' })
  @ApiParam({ name: 'id', description: '虚拟机ID' })
  @Get('vm/reboot/:id')
  public async rebootVM(@Param('id') id: string) {
    responseError(ErrorCode.COMMON_NOT_IMPLEMENTED)
  }
}
