/**
 * 创建云桌面申请
 * 请求参数
 */
export interface ICreateDesktopRequestBodyDto {
  /** 申请天数 */
  duration: number
  /** 申请材料列表 */
  attachments: string[]
}