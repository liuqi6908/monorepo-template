import type { IDesktopQueueHistory } from '../../entities/desktop-queue-history.interface'
import type { IDesktopQueue } from '../../entities/desktop-queue.interface'
import type { IDesktop } from '../../entities/desktop.interface'
import type { IBasicResponse } from '../basic.interface'

/**
 * 查询当前用户的云桌面申请
 * 响应数据
 */
export interface IGetOwnDesktopReqResData {
  /** 当前的云桌面申请，当状态为 待审核｜排队中｜使用中 时存在  */
  queue?: IDesktopQueue
  /** 排在当前用户前的人数 */
  queueLength?: number
  /** 当前用户最近一次被驳回的申请信息，当 `queue` 存在时，该字段不存在 */
  lastRejected?: IDesktopQueueHistory
  /** 用户上一次过期的云桌面，与 `lastRejected` 二选一 */
  lastExpired?: IDesktop
  /** 云桌面资源是否已经被分配完毕，当状态为 排队中 时存在 */
  isResourcesAllocated?: boolean
}

/**
 * 查询当前用户的云桌面申请的响应
 */
export interface IGetOwnDesktopReqResDto extends IBasicResponse<IGetOwnDesktopReqResData> {}
