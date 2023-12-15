import { DESKTOP_REQUEST_DURATION_OPTION } from '../constants/desktop-request.constant'

export interface IExportConfigDto {
  /** 外发配置 */
  export?: {
    /** 小文件尺寸限制，单位为 字节 */
    sizeLimitSm: number
    /** 大文件尺寸限制，单位为 字节 */
    sizeLimitLg: number
    /** 小文件每日外发限制 */
    dailyLimit: number
  }
}

export interface IUploadWorkConfigDto {
  /** 上传作品配置 */
  work?: {
    /** 上传作品尺寸限制，单位为 字节 */
    sizeLimit: number
    /** 上传作品可接受文件后缀列表 */
    acceptLimit: string[]
  }
}

export interface IDesktopRequestConfigDto {
  /** 云桌面申请配置 */
  desktop?: {
    /** 云桌面申请时长配置 */
    duration: typeof DESKTOP_REQUEST_DURATION_OPTION
  }
}

export type IConfigDto = IExportConfigDto & IUploadWorkConfigDto & IDesktopRequestConfigDto