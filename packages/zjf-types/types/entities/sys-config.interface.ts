import type { IConfigDto } from '../dto/config.interface'

/**
 * 全局配置
 */
export interface ISysConfig {
  /** 配置版本 */
  version: string
  /** 系统配置 */
  config: IConfigDto
}
