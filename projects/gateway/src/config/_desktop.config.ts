import { registerAs } from '@nestjs/config'
import { parseBoolRaw } from 'zjf-utils'

export interface DesktopConfig {
  port?: string
  safe?: string
  /** 云桌面服务类型（0：ZStack、1：Hyper-V） */
  type?: number
  domainUser?: boolean
}

export default registerAs('desktop', (): DesktopConfig => {
  const type = process.env.DESKTOP_TYPE?.toLowerCase()
  return {
    port: process.env.DESKTOP_REMOTE_PORT,
    safe: process.env.DESKTOP_REMOTE_SAFE,
    type: type === 'zstack' ? 0 : (type === 'hyperv' ? 1 : undefined),
    domainUser: parseBoolRaw(process.env.DESKTOP_DOMAIN_USER),
  }
})
