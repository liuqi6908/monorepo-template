/**
 * 大文件外发审核状态
 */
export enum FileExportLargeStatus {
  /** 待审核 */
  PENDING = 'pending',
  /** 已通过 */
  APPROVED = 'approved',
  /** 已驳回 */
  REJECTED = 'rejected',
}

/**
 * 大文件外发审核状态的描述
 */
export const fileExportLargeStatusDescriptions: Record<FileExportLargeStatus, string> = {
  [FileExportLargeStatus.PENDING]: '待审核',
  [FileExportLargeStatus.APPROVED]: '已通过',
  [FileExportLargeStatus.REJECTED]: '已驳回',
}
