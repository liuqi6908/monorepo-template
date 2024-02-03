import type {
  IBatchRejectDesktopReqBodyDto,
  ICreateDesktopRequestBodyDto,
  ICreateUserDesktopRequestBodyDto,
  IDesktopQueue,
  IGetOwnDesktopReqResData,
  IPaginatedResData,
  IQueryDto,
  IRejectDesktopReqBodyDto,
  IUser,
} from 'zjf-types'
import { useRequest } from '../composables/request'

const { $get, $post, $put } = useRequest()

/**
 * 发起一个云桌面使用申请
 */
export function createDesktopRequestApi(body: ICreateDesktopRequestBodyDto) {
  return $put<string>('/desktop-request', body)
}

/**
 * 创建一个云桌面使用申请（管理员操作）
 */
export function createUserDesktopRequestApi(body: ICreateUserDesktopRequestBodyDto) {
  return $put<string>('/desktop-request/create', body)
}

/**
 * 通过一个云桌面申请
 */
export function approveDesktopRequestApi(userId: IUser['id']) {
  return $post<boolean>(`/desktop-request/approve/${userId}`)
}

/**
 * 批量通过云桌面申请
 */
export function batchApproveDesktopRequestApi(body: IUser['id'][]) {
  return $post<number>('/desktop-request/approve/batch', body)
}

/**
 * 驳回一个云桌面申请
 */
export function rejectDesktopRequestApi(userId: IUser['id'], body: IRejectDesktopReqBodyDto) {
  return $post<boolean>(`/desktop-request/reject/${userId}`, body)
}

/**
 * 批量驳回云桌面申请
 */
export function batchRejectDesktopRequestApi(body: IBatchRejectDesktopReqBodyDto) {
  return $post<number>('/desktop-request/reject/batch', body)
}

/**
 * 获取当前用户的云桌面使用申请情况
 */
export function getOwnDesktopRequestApi() {
  return $get<IGetOwnDesktopReqResData>('/desktop-request/own')
}

/**
 * 查询云桌面申请
 */
export function queryDesktopRequestApi(body: IQueryDto<IDesktopQueue>) {
  return $post<IPaginatedResData<IDesktopQueue>>('/desktop-request/query', body)
}
