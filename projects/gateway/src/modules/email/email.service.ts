import * as nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CodeAction } from 'zjf-types'

import { getLoginCodeHTML } from 'src/utils/html/templates/login-code'
import { getRegisterCodeHTML } from 'src/utils/html/templates/register-code'
import { getBindEmailCodeHTML } from 'src/utils/html/templates/bind-email-code'
import { getChangePswdCodeHTML } from 'src/utils/html/templates/change-pswd-code'
import { getChangeEmailCodeHTML } from 'src/utils/html/templates/change-email-code'
import { CodeService } from '../code/code.service'
import { SysConfigService } from '../config/config.service'
import type { LoginByEmailLinkDto } from '../auth/dto/login-by-email-link.body.dto'
import type { SendEmailCodeBodyDto } from './dto/send-email-code.body.dto'

@Injectable()
export class EmailService {
  readonly transporter: nodemailer.Transporter
  private readonly _mailCfg: any

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _codeSrv: CodeService,
  ) {
    this._mailCfg = _cfgSrv.get('email.smtp')
    this.transporter = nodemailer.createTransport(this._mailCfg)
  }

  getClient() {
    return this.transporter
  }

  /**
   * 发送邮件
   * @param mailOptions
   * @returns
   */
  send(mailOptions: nodemailer.SendMailOptions) {
    try {
      this.transporter.sendMail({
        ...mailOptions,
        from: `${SysConfigService.appName}系统通知 <${this._mailCfg?.auth?.user}>`,
      })
    }
    catch (e) {
      console.error(e)
    }
  }

  /**
   * 发送验证码
   * @param body
   * @returns
   */
  public async sendCode(body: SendEmailCodeBodyDto) {
    const expInMin = 5
    const { email, action } = body
    const { code, bizId } = await this._codeSrv.createCode(email, action, expInMin)

    let html, subject
    if (action === CodeAction.REGISTER) {
      const res = getRegisterCodeHTML(code)
      html = res.html
      subject = res.subject
    }
    else if (action === CodeAction.UNBIND_EMAIL) {
      const res = getChangeEmailCodeHTML(code)
      html = res.html
      subject = res.subject
    }
    else if (action === CodeAction.CHANGE_PASSWORD) {
      const res = getChangePswdCodeHTML(code)
      html = res.html
      subject = res.subject
    }
    else if (action === CodeAction.LOGIN) {
      const res = getLoginCodeHTML(code)
      html = res.html
      subject = res.subject
    }
    else if (action === CodeAction.BIND_EMAIL) {
      const res = getBindEmailCodeHTML(code)
      html = res.html
      subject = res.subject
    }
    else {
      subject = `ZJF ${action}`
      html = `<p>Your code for ${action} is: <strong>${code}</strong>, expire in ${expInMin} minutes</p>`
    }
    this.send({
      to: email,
      subject,
      html,
    })
    return { bizId }
  }

  /**
   * 发送登录魔法链接
   * @param body
   * @param token
   */
  public async sendMagicLink(body: LoginByEmailLinkDto, token: string) {
    const href = `${body.redirect}${body.redirect.includes('?') ? '&' : '?'}${body.queryName || 'token'}=${token}`
    this.send({
      to: body.email,
      subject: 'ZJF Login',
      html: `<a href="${href}">Click here to Login</a>, or copy this link to your browser: ${href}`,
    })
  }
}
