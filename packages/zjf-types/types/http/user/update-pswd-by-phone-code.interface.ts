import type { IPhoneDto } from '../../dto/phone.interface'
import type { IPasswordDto } from '../../dto/password.interface'
import type { ICodeVerifyDto } from '../../dto/code-verify.interface'

/**
 * 根据手机验证码修改密码
 * 请求参数
 */
export interface IUpdatePasswordByPhoneCodeBodyDto extends IPasswordDto, IPhoneDto, ICodeVerifyDto {}
