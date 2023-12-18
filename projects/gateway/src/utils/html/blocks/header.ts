import { SysConfigService } from 'src/modules/config/config.service'
import { HtmlTag } from '..'

export const header = () => HtmlTag.create('div').text(`尊敬的${SysConfigService.appName}用户：`)
export const adminHeader = () => HtmlTag.create('div').text(`尊敬的${SysConfigService.appName}管理老师：`)
