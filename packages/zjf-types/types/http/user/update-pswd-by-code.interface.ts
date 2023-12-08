import { IEmailDto } from '../../dto/email.interface'
import { IPasswordDto } from '../../dto/password.interface'
import { ICodeVerifyDto } from '../../dto/code-verify.interface'

/**
 * 根据邮箱验证码修改密码
 * 请求参数
 */
export interface IUpdatePasswordByCodeBodyDto extends IPasswordDto, IEmailDto, ICodeVerifyDto {}