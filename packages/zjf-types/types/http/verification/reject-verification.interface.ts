/**
 * 驳回认证申请
 * 请求参数
 */
export interface IRejectVerificationBodyDto {
  /** 拒绝的原因 */
  reason: string
}