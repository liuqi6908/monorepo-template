import type { IVerificationIdDto } from '../../dto/id/verification.interface'

/**
 * 驳回认证申请
 * 请求参数
 */
export interface IRejectVerificationBodyDto {
  /** 拒绝的原因 */
  reason: string
}

/**
 * 批量驳回认证申请
 * 请求参数
 */
export interface IBatchRejectVerificationBodyDto {
  /** id */
  id: IVerificationIdDto['verificationId'][]
  /** 拒绝的原因 */
  reason: string
}
