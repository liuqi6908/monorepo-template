import type {
  IVerificationHistory,
  ICreateVerificationBodyDto,
  IQueryDto,
  IPaginatedResData,
  IRejectVerificationBodyDto
} from 'zjf-types'
import { useRequest } from '~/composables'

const { $get, $delete, $patch, $post, $put } = useRequest()

/**
 * 发起一个认证申请
 */
export function createVerificationApi(body: ICreateVerificationBodyDto) {
  return $put<IVerificationHistory>('/verification', body)
}

/**
 * 获取最近一次的申请认证记录
 */
export function getLatestVerificationApi() {
  return $get<IVerificationHistory>('/verification/latest')
}

/**
 * 查询所有用户的认证申请
 */
export function queryAllVerificationsApi(body: IQueryDto<IVerificationHistory>) {
  return $post<IPaginatedResData<IVerificationHistory>>('/verification/query', body)
}

/**
 * 取消一个认证申请
 */
export function cancelVerificationApi(verificationId: string) {
  return $delete<IVerificationHistory>(`/verification/cancel/${verificationId}`)
}

/**
 * 通过一个认证申请
 */
export function approveVerificationApi(verificationId: string) {
  return $patch<IVerificationHistory>(`/verification/approve/${verificationId}`)
}

/**
 * 驳回一个认证申请
 */
export function rejectVerificationApi(verificationId: string, body: IRejectVerificationBodyDto) {
  return $patch<boolean>(`/verification/reject/${verificationId}`, body)
}
