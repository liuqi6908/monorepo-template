import type { IVersionDto } from '../dto/version.interface'
import type { IConfigDto } from '../dto/config.interface'
import type { SysConfig } from '../enum/config.enum'

/**
 * 全局配置
 */
export interface ISysConfig<T extends SysConfig> extends IVersionDto<T> {
  /** 系统配置 */
  config?: IConfigDto[T]
}
