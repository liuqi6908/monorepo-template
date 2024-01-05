/**
 * 系统全局配置
 */
export enum SysConfig {
  /** App配置 */
  APP = 'app',
  /** 云桌面申请配置 */
  DESKTOP = 'desktop',
  /** 外发配置 */
  EXPORT = 'export',
  /** 首页导航栏配置 */
  NAV = 'nav',
  /** 身份认证上传配置 */
  VERIFICATION = 'verification',
  /** 上传作品配置 */
  WORK = 'work',
}

/**
 * 系统全局配置的描述
 */
export const sysConfigDescriptions: Record<SysConfig, string> = {
  [SysConfig.APP]: 'App配置',
  [SysConfig.DESKTOP]: '云桌面申请配置',
  [SysConfig.EXPORT]: '外发配置',
  [SysConfig.NAV]: '首页导航栏配置',
  [SysConfig.VERIFICATION]: '身份认证上传配置',
  [SysConfig.WORK]: '上传作品配置',
}
