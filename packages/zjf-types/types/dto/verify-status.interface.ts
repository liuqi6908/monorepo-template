import type { VerificationStatus } from '../enum/verification.enum'

export interface IVerifyStatusDto {
  /** 认证状态 */
  status: VerificationStatus
}

export interface IVerifyStatusOptionalDto extends Partial<IVerifyStatusDto> { }
