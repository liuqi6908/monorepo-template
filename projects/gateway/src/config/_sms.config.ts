import { registerAs } from '@nestjs/config'

export interface SmsConfig {
  /** AccessKey ID */
  ak: string
  /** AccessKey Secret */
  sk: string
  /** 短信签名 */
  sign: string
  /** 发送验证码 短信模板code */
  templateCode: string
}

export default registerAs('sms', (): SmsConfig => ({
  ak: process.env.SMS_AK,
  sk: process.env.SMS_SK,
  sign: process.env.SMS_SIGN,
  templateCode: process.env.SMS_TEMPLATE_CODE,
}))
