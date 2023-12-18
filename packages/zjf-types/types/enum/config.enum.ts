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
  /** 上传作品配置 */
  WORK = 'work'
}

/**
 * 系统全局配置的描述
 */
export const sysConfigDescriptions: Record<SysConfig, string> = {
  [SysConfig.APP]: 'App配置',
  [SysConfig.DESKTOP]: '云桌面申请配置',
  [SysConfig.EXPORT]: '外发配置',
  [SysConfig.WORK]: '上传作品配置',
}