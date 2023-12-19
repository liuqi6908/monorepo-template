import type { IAccountDto } from '../dto/account.interface'
import type { IEmailOptionalDto } from '../dto/email.interface'
import type { ICreatedAt } from './_timestamp.interface'
import type { IUser } from './user.interface'

/**
 * 已删除用户
 */
export interface IUserDeleted extends
  ICreatedAt,
  IAccountDto,
  IEmailOptionalDto {
  /** 自动生成的 uuid v4 */
  id: string
  /** 用户唯一标识 */
  userId: string
  /** 删除的用户记录关联 */
  user?: IUser
}
