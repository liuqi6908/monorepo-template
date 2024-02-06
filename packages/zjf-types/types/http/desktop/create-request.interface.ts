import type { IUserIdDto } from '../../dto/id/user.interface'

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
 * 批量创建用户云桌面申请（管理员操作）
 * 请求参数
 */
export interface IBatchCreateUserDesktopRequestBodyDto {
  /** 用户id */
  id: IUserIdDto['userId'][]
  /** 申请天数 */
  duration: number
}
