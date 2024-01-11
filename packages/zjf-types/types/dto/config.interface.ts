import type { DESKTOP_REQUEST_DURATION_OPTION } from '../constants/desktop.constant'
import type { SysConfig } from '../enum/config.enum'

export interface IConfigDto {
  /** App配置 */
  [SysConfig.APP]?: {
    /** 应用名称 */
    name?: string
    /** 应用图标 */
    icon?: string
    /** 应用英文名称 */
    nameEn?: string
  }

  /** 云桌面配置 */
  [SysConfig.DESKTOP]?: {
    /** 申请时长配置 */
    duration?: typeof DESKTOP_REQUEST_DURATION_OPTION
    /** 上传尺寸限制，单位为 字节 */
    sizeLimit?: number
    /** 上传数量限制 */
    amountLimit?: number
    /** 上传可接受文件后缀列表 */
    acceptLimit?: string[]
    /** 上传提示信息 */
    hint?: string
    /** 云桌面资源最大数量 */
    max?: number
    /** 云桌面FTP文件传输配额 */
    ftpQuota?: number
  }

  /** 外发配置 */
  [SysConfig.EXPORT]?: {
    /** 小文件尺寸限制，单位为 字节 */
    sizeLimitSm?: number
    /** 大文件尺寸限制，单位为 字节 */
    sizeLimitLg?: number
    /** 小文件每日外发限制 */
    dailyLimit?: number
  }

  /** 首页导航栏配置 */
  [SysConfig.NAV]?: {
    /** 首页标签 */
    homeLabel?: string
    /** 首页描述 */
    homeDesc?: string
    /** 数据库标签 */
    databaseLabel?: string
    /** 数据库描述 */
    databaseDesc?: string
    /** 常见问题标签 */
    questionLabel?: string
    /** 常见问题描述 */
    questionDesc?: string
    /** 申请使用标签 */
    requestLabel?: string
    /** 申请使用描述 */
    requestDesc?: string
  }

  /** 身份认证上传配置 */
  [SysConfig.VERIFICATION]?: {
    /** 上传尺寸限制，单位为 字节 */
    sizeLimit?: number
    /** 上传数量限制 */
    amountLimit?: number
    /** 上传可接受文件后缀列表 */
    acceptLimit?: string[]
    /** 上传提示信息 */
    hint?: string
  }

  /** 上传作品配置 */
  [SysConfig.WORK]?: {
    /** 上传尺寸限制，单位为 字节 */
    sizeLimit?: number
    /** 上传可接受文件后缀列表 */
    acceptLimit?: string[]
    /** 上传提示信息 */
    hint?: string
    /** 上传作品数量限制（0表示没有限制） */
    amount?: number
  }
}
