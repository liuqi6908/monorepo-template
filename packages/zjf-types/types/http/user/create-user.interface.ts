import type { IUser } from '../../entities/user.interface'
import type { IPasswordOptionalDto } from '../../dto/password.interface'
import type { IAccountDto } from '../../dto/account.interface'
import type { IEmailDto } from '../../dto/email.interface'
import type { INicknameOptionalDto } from '../../dto/nickname.interface'

/**
 * 创建用户
 * 请求参数
 */
export interface ICreateUserBodyDto extends
  IAccountDto,
  IEmailDto,
  IPasswordOptionalDto,
  INicknameOptionalDto {}

/**
 * 创建用户
 * 响应数据
 */
export interface ICreateUserResDto extends IUser {}
