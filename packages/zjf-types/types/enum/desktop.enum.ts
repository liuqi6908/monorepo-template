/**
 * 云桌面申请历史状态
 */
export enum DesktopQueueHistoryStatus {
  /** 已驳回 */
  REJECTED = 'rejected',
  /** 已过期 */
  EXPIRED = 'expired',
  /** 已取消 */
  CANCELED = 'canceled',
}

/**
 * 云桌面申请历史状态的描述
 */
export const desktopQueueHistoryStatusDescriptions: Record<DesktopQueueHistoryStatus, string> = {
  [DesktopQueueHistoryStatus.REJECTED]: '已驳回',
  [DesktopQueueHistoryStatus.EXPIRED]: '已过期',
  [DesktopQueueHistoryStatus.CANCELED]: '已取消',
}

/**
 * 云桌面申请审核状态
 */
export enum DesktopQueueStatus {
  /** 待审核 */
  PENDING = 'pending',
  /** 排队中 */
  QUEUEING = 'queueing',
  /** 使用中 */
  USING = 'using',
}

/**
 * 云桌面申请审核状态的描述
 */
export const desktopQueueStatusDescriptions: Record<DesktopQueueStatus, string> = {
  [DesktopQueueStatus.PENDING]: '待审核',
  [DesktopQueueStatus.QUEUEING]: '排队中',
  [DesktopQueueStatus.USING]: '使用中',
}

/**
 * 云桌面状态
 */
export enum DesktopStatus {
  /** 开机中 */
  STARTING = 'Starting',
  /** 运行中 */
  RUNNING = 'Running',
  /** 关机中 */
  STOPPING = 'Stopping',
  /** 已关机 */
  STOPPED = 'Stopped',
  /** 重启中 */
  REBOOTING = 'Rebooting',
}

/**
 * 云桌面状态的描述
 */
export const desktopStatusDescriptions: Record<DesktopStatus, string> = {
  [DesktopStatus.STARTING]: '开机中',
  [DesktopStatus.RUNNING]: '运行中',
  [DesktopStatus.STOPPING]: '关机中',
  [DesktopStatus.STOPPED]: '已关机',
  [DesktopStatus.REBOOTING]: '重启中',
}
