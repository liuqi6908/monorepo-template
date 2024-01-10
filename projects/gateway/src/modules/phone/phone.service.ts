import Client, * as $dysmsapi from '@alicloud/dysmsapi20170525'
import * as $OpenApi from '@alicloud/openapi-client'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ErrorCode } from 'zjf-types'

import type { SmsConfig } from 'src/config/_sms.config'
import { responseError } from 'src/utils/response'
import { CodeService } from '../code/code.service'
import type { SendPhoneCodeBodyDto } from './dto/send-phone-code.body.dto'

@Injectable()
export class PhoneService {
  private readonly _phoneCfg: SmsConfig
  private _client: Client

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _codeSrv: CodeService,
  ) {
    this._phoneCfg = _cfgSrv.get<SmsConfig>('sms')
  }

  getClient() {
    console.log(this._phoneCfg)
    if (this._client)
      return this._client
    const config = new $OpenApi.Config({
      accessKeyId: this._phoneCfg.ak,
      accessKeySecret: this._phoneCfg.sk,
    })
    return this._client = new Client(config)
  }

  /**
   * 发送短信
   * @param phone 手机号
   * @param code 验证码
   * @returns
   */
  async send(phone: string, code: string) {
    const client = this.getClient()
    const sendReq = new $dysmsapi.SendSmsRequest({
      phoneNumbers: phone,
      signName: this._phoneCfg.sign,
      templateCode: this._phoneCfg.templateCode,
      templateParam: `{code:${code}}`,
    })
    return await client.sendSms(sendReq)
  }

  /**
   * 发送验证码
   * @param body
   * @returns
   */
  public async sendCode(body: SendPhoneCodeBodyDto) {
    const expInMin = 5
    const { phone, action } = body
    const { code, bizId } = await this._codeSrv.createCode(phone, action, expInMin)

    const res = await this.send(phone, code)
    const { code: status, message } = res.body
    if (status !== 'OK')
      responseError(ErrorCode.SMS_SEND_FAIL, message)
    return { bizId }
  }
}
