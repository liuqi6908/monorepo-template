import { DesktopQueueHistoryStatus, DesktopQueueStatus } from 'zjf-types'
import type { IDesktop } from 'zjf-types'
import type { VMState } from 'shared/types/desktop.interface'

/** 云桌面申请状态 */
const requestStatus = ref<DesktopQueueStatus | DesktopQueueHistoryStatus>()
/** 等待分配云桌面队列长度 */
const queueLen = ref<number>()
/** 申请驳回理由 */
const rejectReason = ref<string>()
/** 云桌面信息 */
const desktopInfo = ref<IDesktop>()
/** 虚拟机信息 */
const vmInfo = ref<VMState>()

export function useDesktop() {
  /**
   * 获取云桌面申请情况
   */
  async function getDesktopRequest() {
    const res = await getOwnDesktopRequestApi()
    if (res) {
      const { lastExpired, lastRejected, queue, queueLength } = res
      let status = queue?.status || lastRejected?.status || (lastExpired?.id ? DesktopQueueHistoryStatus.EXPIRED : undefined)
      if (status === DesktopQueueStatus.USING && !desktopInfo.value) {
        desktopInfo.value = await getOwnDesktopApi()
        if (new Date(desktopInfo.value?.expiredAt).getTime() < new Date().getTime())
          status = DesktopQueueHistoryStatus.EXPIRED
      }
      requestStatus.value = status
      queueLen.value = queueLength ?? 0
      rejectReason.value = lastRejected?.rejectReason
    }
  }

  /**
   * 获取虚拟机信息
   */
  async function getVmInfo() {
    if (!desktopInfo.value?.id)
      return
    vmInfo.value = await getVMStateApi(desktopInfo.value.id)
  }

  return {
    requestStatus,
    queueLen,
    rejectReason,
    desktopInfo,
    vmInfo,
    getDesktopRequest,
    getVmInfo,
  }
}
