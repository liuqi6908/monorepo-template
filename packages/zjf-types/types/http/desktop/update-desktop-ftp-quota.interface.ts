import type { IDesktop } from '../../entities/desktop.interface'

/**
 * 批量更新云桌面文件传输配额
 * 请求参数
 */
export interface IBatchUpdateDesktopFtpQuotaBodyDto {
  id: IDesktop['id'][]
  ftpQuota: number
}
