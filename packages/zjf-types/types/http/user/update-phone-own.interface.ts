import type { ICodeVerifyDto } from '../../dto/code-verify.interface'
import type { IPhoneDto } from '../../dto/phone.interface'

/**
 * 更新手机号
 * 请求参数
 */
export interface IUpdatePhoneOwnBodyDto extends ICodeVerifyDto, IPhoneDto {}
