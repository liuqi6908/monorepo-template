import { ConfigService } from '@nestjs/config'
import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import type { DesktopConfig } from 'src/config/_desktop.config'
import { VerifiedRequired } from 'src/guards/verify-required.guard'
import { ZstackService } from '../../zstack/zstack.service'
import { HyperVService } from '../../hyper-v/hyper-v.service'

@VerifiedRequired()
@ApiTags('DesktopHost | 云桌面物理机')
@Controller('desktop-host')
export class DesktopHostController {
  private _type: number

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _zstackSrv: ZstackService,
    private readonly _hyperVSrv: HyperVService,
  ) {
    this._type = this._cfgSrv.get<DesktopConfig>('desktop').type
  }

  @ApiOperation({ summary: '获取云桌面物理机列表' })
  @Get()
  public async getHostList() {
    if (this._type === 0)
      return await this._zstackSrv.getHostList()
    else if (this._type === 1)
      return await this._hyperVSrv.getHostList()
  }

  @ApiOperation({ summary: '获取指定物理机的 CPU、内存分配' })
  @ApiParam({ name: 'hostId', description: '物理机ID' })
  @Get(':hostId')
  public async getHostAllocation(@Param('hostId') hostId: string) {
    if (this._type === 0)
      return await this._zstackSrv.getHostCpuMem(hostId)
    else if (this._type === 1)
      return await this._hyperVSrv.getHostCpuMem(hostId)
  }

  @ApiOperation({ summary: '获取指定物理机的时序数据' })
  @ApiParam({ name: 'hostId', description: '物理机ID' })
  @Get('time-series/:hostId')
  public async getHostTimeSeries(@Param('hostId') hostId: string) {
    return this._zstackSrv.getHostMonitor(hostId)
  }

  @ApiOperation({ summary: '获取集群整体的存储使用情况' })
  @Get('cluster/storage')
  public async getClusterStorage() {
    return await this._zstackSrv.getClusterStorage()
  }
}
