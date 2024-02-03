import type { IDesktopQueue } from '../../entities/desktop-queue.interface'

/**
 * 驳回云桌面申请
 * 请求参数
 */
export interface IRejectDesktopReqBodyDto {
  /** 驳回的理由 */
  reason: string
}

/**
 * 批量驳回云桌面申请
 * 请求参数
 */
export interface IBatchRejectDesktopReqBodyDto {
  /** id */
  id: IDesktopQueue['userId'][]
  /** 驳回的理由 */
  reason: string
}
