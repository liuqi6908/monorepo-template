import type { PhoneCodeAction } from '../enum/phone-code-action.enum'

export interface IPhoneCodeActionDto {
  /** 请求手机验证码用于 */
  action: PhoneCodeAction
}
