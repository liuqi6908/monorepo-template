import { getUserName } from 'src/utils/get-user-name'
import type { Desktop } from 'src/entities/desktop'

import footer from '../blocks/footer'
import { HtmlTag } from '..'
import { DANGER } from '../assets/color'
import { header } from '../blocks/header'
import { getDesktopConnectInfo } from './desktop-assigned'

/**
 * 当云桌面信息发生变化时，发送邮件通知
 * @param desktop
 */
export function getDesktopInfoChangedHTML(desktop: Desktop) {
  const subject = '【云桌面信息修改通知】用户云桌面信息修改提示'
  const html = HtmlTag
    .create('div')
    .appendChild(
      header(),
      HtmlTag
        .create('div')
        .indent()
        .appendChild(
          HtmlTag.create('span').text('您好！用户'),
          HtmlTag.create('span').text(`【${getUserName(desktop.user)}】`).style({ fontWeight: '500' }).color(DANGER),
          HtmlTag.create('span').text('，管理员修改了您的云桌面信息。'),
        ),
      getDesktopConnectInfo(),
      HtmlTag.create('div').indent().text('如有其他疑问，可微信扫码联系客服！'),
      footer,
    )
    .raw()
  return { subject, html }
}
