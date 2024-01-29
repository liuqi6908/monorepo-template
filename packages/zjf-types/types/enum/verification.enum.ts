/**
 * 认证状态
 */
export enum VerificationStatus {
  /** 待审核 */
  PENDING = 'pending',
  /** 已通过 */
  APPROVED = 'approved',
  /** 已驳回 */
  REJECTED = 'rejected',
  /** 已取消 */
  CANCELLED = 'cancelled',
}

/**
 * 认证状态的描述
 */
export const verificationStatusDescriptions: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: '待审核',
  [VerificationStatus.APPROVED]: '已通过',
  [VerificationStatus.REJECTED]: '已驳回',
  [VerificationStatus.CANCELLED]: '已取消',
}
