import { SysConfigService } from 'src/modules/config/config.service'
import type { Desktop } from 'src/entities/desktop'
import { getUserName } from 'src/utils/get-user-name'

import { HtmlTag } from '..'
import { header } from '../blocks/header'
import { DANGER } from '../assets/color'
import footer from '../blocks/footer'

export function getDesktopConnectInfo() {
  return HtmlTag
    .create('div')
    .appendChild(
      HtmlTag
        .create('div')
        .indent()
        .appendChild(
          HtmlTag.create('span').text('请在'),
          HtmlTag.create('span').text('【用户中心/我的桌面】').color(DANGER).style({ fontWeight: '500' }),
          HtmlTag.create('span').text('中查看登录信息。'),
        ),
      HtmlTag.create('div').indent().text(`登录云桌面的使用教程请查看${SysConfigService.appName}的常见问题解答板块。`),
    )
}

export function getDesktopAssignedHTML(desktop: Desktop) {
  const subject = `【云桌面开通通知】${SysConfigService.appName}云桌面开通提示`
  const html = HtmlTag
    .create('div')
    .appendChild(
      header(),
      HtmlTag
        .create('div')
        .indent()
        .appendChild(
          HtmlTag.create('span').text('您好！用户'),
          HtmlTag.create('span').text(`【${getUserName(desktop.user)}】`).color(DANGER).style({ fontWeight: '500' }),
          HtmlTag.create('span').text('，您提交的云桌面申请已经通过，管理员已经为您分配好云桌面。'),
        ),
      getDesktopConnectInfo(),
      HtmlTag.create('div').indent().text('如有其他疑问，可微信扫码联系客服！'),
      footer,
    )
    .raw()

  return { subject, html }
}
