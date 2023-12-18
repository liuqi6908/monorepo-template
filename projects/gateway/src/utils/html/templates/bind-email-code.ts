import { SysConfigService } from 'src/modules/config/config.service'
import footer from '../blocks/footer'
import { HtmlTag } from '..'
import { header } from '../blocks/header'
import { getVerifyCode, getVerifyCodeDesc } from '../blocks/verify-code'

/**
 * 绑定邮箱的验证码
 * @param code
 */
export function getBindEmailCodeHTML(code: string) {
  const p1 = HtmlTag.create('p').text(`我们已收到您关于绑定${SysConfigService.appName}邮箱的请求。您的验证码为：`).indent()
  const subject = `【验证码】绑定${SysConfigService.appName}邮箱`

  const html = HtmlTag.create('div')
    .appendChild(header())
    .appendChild(p1)
    .appendChild(getVerifyCode(code).style({ margin: '20px 0' }))
    .appendChild(getVerifyCodeDesc())
    .appendChild(footer)
    .raw()
  return { subject, html }
}
