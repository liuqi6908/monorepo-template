import type { IPhoneDto } from '../../dto/phone.interface'
import type { ICodeVerifyDto } from '../../dto/code-verify.interface'

/**
 * 根据手机号码验证码登录
 * 请求参数
 */
export interface ILoginByPhoneCodeBodyDto extends IPhoneDto, ICodeVerifyDto {}
