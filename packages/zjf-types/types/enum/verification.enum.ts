/**
 * 认证状态
 */
export enum VerificationStatus {
  /** 审核中 */
  PENDING = 'pending',
  /** 已通过 */
  APPROVED = 'approved',
  /** 已拒绝 */
  REJECTED = 'rejected',
  /** 已取消 */
  CANCELLED = 'cancelled',
}

/**
 * 认证状态的描述
 */
export const verificationStatusDescriptions: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: '审核中',
  [VerificationStatus.APPROVED]: '已通过',
  [VerificationStatus.REJECTED]: '已拒绝',
  [VerificationStatus.CANCELLED]: '已取消',
}
