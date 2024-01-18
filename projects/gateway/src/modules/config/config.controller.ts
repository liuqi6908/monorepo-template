import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { HasPermission } from 'src/guards/permission.guard'
import { PermissionType } from 'zjf-types'
import type { Config } from 'src/entities/config'
import { VersionDto } from 'src/dto/version.dto'

import { SysConfigService } from './config.service'
import { ConfigResDto } from './dto/config.res.dto'
import { UpsertConfigBodyDto } from './dto/upsert-config.body.dto'

@ApiTags('Config | 全局配置')
@Controller('config')
export class ConfigController {
  constructor(
    private readonly _sysCfgSrv: SysConfigService,
  ) {}

  @ApiOperation({ summary: '获取指定全局配置' })
  @ApiSuccessResponse(ConfigResDto)
  @Get(':version')
  public async getConfig(@Param() param: VersionDto) {
    return await this._sysCfgSrv.getConfig(param)
  }

  @ApiOperation({
    summary: '创建/更新 全局配置',
    description: '配置版本为唯一标识，如果存在，则会更新配置内容',
  })
  @HasPermission([
    PermissionType.CONFIG_UPSERT_APP,
    PermissionType.CONFIG_UPSERT_DESKTOP_REQUEST,
    PermissionType.CONFIG_UPSERT_DESKTOP,
    PermissionType.CONFIG_UPSERT_DESKTOP_FTP,
    PermissionType.CONFIG_UPSERT_EXPORT,
    PermissionType.CONFIG_UPSERT_VERIFICATION,
    PermissionType.CONFIG_UPSERT_WORK,
  ])
  @ApiSuccessResponse(ConfigResDto)
  @Post()
  public async upsertConfig(
    @Body() body: UpsertConfigBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const { version, ...config } = body
    this._sysCfgSrv.hasPermission(version, req.raw.user)
    const obj: Config = {
      version,
      config: config[version],
    }
    return (await this._sysCfgSrv.repo().save(obj)).config
  }
}
