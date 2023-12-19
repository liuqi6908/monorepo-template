import type { IEmailDto } from '../../dto/email.interface'
import type { IAccountDto } from '../../dto/account.interface'
import type { IPasswordDto } from '../../dto/password.interface'
import type { ICodeVerifyDto } from '../../dto/code-verify.interface'

/**
 * 注册用户
 * 请求参数
 */
export interface IRegisterBodyDto extends
  IAccountDto,
  IEmailDto,
  IPasswordDto,
  ICodeVerifyDto {}
