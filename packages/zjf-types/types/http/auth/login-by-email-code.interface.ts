
import { IEmailDto } from '../../dto/email.interface'
import { ICodeVerifyDto } from '../../dto/code-verify.interface'

/**
 * 根据邮箱验证码登录
 * 请求参数
 */
export interface ILoginByEmailCodeBodyDto extends IEmailDto, ICodeVerifyDto {}