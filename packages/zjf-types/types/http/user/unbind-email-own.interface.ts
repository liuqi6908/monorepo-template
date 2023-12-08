
import { ICodeVerifyDto } from '../../dto/code-verify.interface'
import { IEmailDto } from '../../dto/email.interface'

/**
 * 解绑邮箱
 * 请求参数
 */
export interface IUnbindEmailOwnBodyDto extends ICodeVerifyDto, IEmailDto {}