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

/**
 * 创建用户云桌面申请（管理员操作）
 * 请求参数
 */
export interface ICreateUserDesktopRequestBodyDto {
  /** 用户id */
  userId: string
  /** 申请天数 */
  duration: number
}