import type {
  IBatchRejectVerificationBodyDto,
  ICreateVerificationBodyDto,
  IPaginatedResData,
  IQueryDto,
  IRejectVerificationBodyDto,
  IVerificationHistory,
  IVerificationIdDto,
} from 'zjf-types'
import { useRequest } from '../composables/request'

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
export function cancelVerificationApi(verificationId: IVerificationIdDto['verificationId']) {
  return $delete<IVerificationHistory>(`/verification/cancel/${verificationId}`)
}

/**
 * 批量取消用户认证申请
 */
export function batchCancelVerificationApi(body: IVerificationIdDto['verificationId'][]) {
  return $delete<number>('/verification/cancel/batch', body)
}

/**
 * 通过一个认证申请
 */
export function approveVerificationApi(verificationId: IVerificationIdDto['verificationId']) {
  return $patch<IVerificationHistory>(`/verification/approve/${verificationId}`)
}

/**
 * 批量通过用户认证申请
 */
export function batchApproveVerificationApi(body: IVerificationIdDto['verificationId'][]) {
  return $patch<number>('/verification/approve/batch', body)
}

/**
 * 驳回一个认证申请
 */
export function rejectVerificationApi(verificationId: IVerificationIdDto['verificationId'], body: IRejectVerificationBodyDto) {
  return $patch<boolean>(`/verification/reject/${verificationId}`, body)
}

/**
 * 批量驳回用户认证申请
 */
export function batchRejectVerificationApi(body: IBatchRejectVerificationBodyDto) {
  return $patch<number>('/verification/reject/batch', body)
}
