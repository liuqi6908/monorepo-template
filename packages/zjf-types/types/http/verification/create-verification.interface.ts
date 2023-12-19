import type { IBasicResponse } from '../basic.interface'
import type { IVerificationHistory } from '../../entities/verification.interface'

/**
 * 创建认证申请
 * 请求参数
 */
export interface ICreateVerificationBodyDto extends
  Pick<
    IVerificationHistory,
    | 'name'
    | 'school'
    | 'college'
    | 'number'
    | 'idCard'
    | 'dataRole'
    | 'attachments'
  > {}

/**
 * 认证申请
 * 响应数据
 */
export interface IVerificationResDto extends
  IBasicResponse<IVerificationHistory> {}
