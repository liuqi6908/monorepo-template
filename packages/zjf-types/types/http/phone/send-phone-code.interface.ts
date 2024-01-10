import type { IBasicResponse } from '../basic.interface'
import type { IPhoneDto } from '../../dto/phone.interface'
import type { IPhoneCodeActionDto } from '../../dto/phone-code-action.interface'

/**
 * 发送手机验证码
 * 请求参数
 */
export interface ISendPhoneCodeBodyDto extends IPhoneDto, IPhoneCodeActionDto {}

/**
 * 发送手机验证码
 * 响应数据
 */
export interface ISendPhoneCodeResData {
  /** 发送到手机的验证码的唯一标识 */
  bizId: string
}

/**
 * 发送手机验证码的响应
 */
export interface ISendPhoneCodeResDto extends IBasicResponse<ISendPhoneCodeResData> {}
