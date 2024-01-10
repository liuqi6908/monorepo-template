import type { ICodeVerifyDto } from '../../dto/code-verify.interface'
import type { IPhoneDto } from '../../dto/phone.interface'

/**
 * 解绑手机号
 * 请求参数
 */
export interface IUnbindPhoneOwnBodyDto extends ICodeVerifyDto, IPhoneDto {}
