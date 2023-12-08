import { ICodeVerifyDto } from '../../dto/code-verify.interface'
import { IEmailDto } from '../../dto/email.interface'

/**
 * 更新邮箱
 * 请求参数
 */
export interface IUpdateEmailOwnBodyDto extends ICodeVerifyDto, IEmailDto {}