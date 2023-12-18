import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cron } from '@nestjs/schedule'
import { Repository } from 'typeorm'
import { APP_NAME, ErrorCode, PermissionType, SysConfig } from 'zjf-types'
import type { IConfigDto, IUser } from 'zjf-types'
import type { OnModuleInit } from '@nestjs/common'
import { Config } from 'src/entities/config'
import type { VersionDto } from 'src/dto/version.dto'
import { responseError } from 'src/utils/response'

@Injectable()
export class SysConfigService implements OnModuleInit {
  /** 应用名称 */
  private static _appName: string

  constructor(
    @InjectRepository(Config)
    private readonly _sysCfgRepo: Repository<Config>,
  ) {}

  onModuleInit() {
    this.getAppName()
  }

  /**
   * 获取应用名称（每小时执行一次，服务启动立即执行）
   */
  @Cron('0 0 * * * *')
  async getAppName() {
    SysConfigService.appName = (await this.getConfig<SysConfig.APP>({ version: SysConfig.APP }))?.name || APP_NAME
    return SysConfigService.appName
  }

  public static get appName() {
    return SysConfigService._appName
  }

  public static set appName(value: string) {
    SysConfigService._appName = value
  }

  public hasPermission(version: SysConfig, user: IUser) {
    const permissions = user.role?.permissions.map(v => v.name)
    if (
      (version === SysConfig.APP && !permissions.includes(PermissionType.CONFIG_UPSERT_APP))
      || (version === SysConfig.DESKTOP && !permissions.includes(PermissionType.CONFIG_UPSERT_DESKTOP))
      || (version === SysConfig.EXPORT && !permissions.includes(PermissionType.CONFIG_UPSERT_EXPORT))
      || (version === SysConfig.WORK && !permissions.includes(PermissionType.CONFIG_UPSERT_WORK))
    )
      responseError(ErrorCode.PERMISSION_DENIED)
  }

  /**
   * 获取指定的全局配置
   */
  public async getConfig<T extends SysConfig>(param: VersionDto<T>) {
    return (await this._sysCfgRepo.findOne({
      where: { version: param.version },
    }))?.config as IConfigDto[T]
  }

  repo() {
    return this._sysCfgRepo
  }
}
