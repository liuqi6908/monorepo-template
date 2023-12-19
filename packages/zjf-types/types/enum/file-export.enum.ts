/**
 * 大文件外发审核状态
 */
export enum FileExportLargeStatus {
  /** 待处理 */
  PENDING = 'pending',
  /** 已通过 */
  APPROVED = 'approved',
  /** 已拒绝 */
  REJECTED = 'rejected',
}

/**
 * 大文件外发审核状态的描述
 */
export const fileExportLargeStatusDescriptions: Record<FileExportLargeStatus, string> = {
  [FileExportLargeStatus.PENDING]: '待处理',
  [FileExportLargeStatus.APPROVED]: '已通过',
  [FileExportLargeStatus.REJECTED]: '已拒绝',
}
