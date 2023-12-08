import { IUser } from '../../entities/user.interface'
import { IPasswordDto } from '../../dto/password.interface'
import { IAccountDto } from '../../dto/account.interface'
import { IEmailOptionalDto } from '../../dto/email.interface'
import { INicknameOptionalDto } from '../../dto/nickname.interface'

/**
 * 创建用户
 * 请求参数
 */
export interface ICreateUserBodyDto extends
  IPasswordDto,
  IAccountDto,
  IEmailOptionalDto,
  INicknameOptionalDto {}

/**
 * 创建用户
 * 响应数据
 */
export interface ICreateUserResDto extends IUser {}