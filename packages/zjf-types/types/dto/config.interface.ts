import { DESKTOP_REQUEST_DURATION_OPTION } from '../constants/desktop-request.constant'
import { SysConfig } from '../enum/config.enum'

export interface IConfigDto {
  /** App配置 */
  [SysConfig.APP]?: {
    /** 应用名称 */
    name?: string
    /** 应用图标 */
    icon?: string
  }

  /** 云桌面申请配置 */
  [SysConfig.DESKTOP]?: {
    /** 云桌面申请时长配置 */
    duration: typeof DESKTOP_REQUEST_DURATION_OPTION
  }

  /** 外发配置 */
  [SysConfig.EXPORT]?: {
    /** 小文件尺寸限制，单位为 字节 */
    sizeLimitSm: number
    /** 大文件尺寸限制，单位为 字节 */
    sizeLimitLg: number
    /** 小文件每日外发限制 */
    dailyLimit: number
  }

  /** 上传作品配置 */
  [SysConfig.WORK]?: {
    /** 上传作品尺寸限制，单位为 字节 */
    sizeLimit: number
    /** 上传作品可接受文件后缀列表 */
    acceptLimit: string[]
  }
}