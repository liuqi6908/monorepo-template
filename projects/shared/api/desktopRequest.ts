import type {
  ICreateDesktopRequestBodyDto,
  ICreateUserDesktopRequestBodyDto,
  IRejectDesktopReqBodyDto,
  IGetOwnDesktopReqResData,
  IDesktopQueue,
  IQueryDto,
  IPaginatedResData
} from 'zjf-types'
import { useRequest } from '~/composables'

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
export function approveDesktopRequestApi(userId: string) {
  return $post<boolean>(`/desktop-request/approve/${userId}`)
}

/**
 * 驳回一个云桌面申请
 */
export function rejectDesktopRequestApi(userId: string, body: IRejectDesktopReqBodyDto) {
  return $post<boolean>(`/desktop-request/reject/${userId}`, body)
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
