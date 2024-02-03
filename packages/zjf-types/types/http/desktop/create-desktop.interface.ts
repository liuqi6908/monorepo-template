import type { IDesktop } from '../../entities/desktop.interface'

/**
 * 创建云桌面
 * 请求参数
 */
export interface ICreateDesktopBodyDto extends
  Omit<
    IDesktop,
    'user' | 'createdAt' | 'updatedAt' | 'userId'
    | 'lastUser' | 'lastUserId' | 'disabled' | 'ftpQuota'
  > {}
