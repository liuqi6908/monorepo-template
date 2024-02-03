<script lang="ts" setup>
import {
  DesktopQueueStatus, DesktopQueueHistoryStatus,
  desktopQueueStatusDescriptions, desktopQueueHistoryStatusDescriptions,
} from 'zjf-types'

type Status = DesktopQueueStatus | DesktopQueueHistoryStatus

type RequestStyle = Record<Status, {
  label?: string
  color: string
  icon: string
}>

defineProps<{ status: Status }>()

/** 云桌面申请状态样式 */
const requestStyle: RequestStyle = {
  [DesktopQueueStatus.PENDING]: {
    color: 'alerts-warning',
    icon: 'i-mingcute:minus-circle-fill',
  },
  [DesktopQueueStatus.QUEUEING]: {
    label: '待分配',
    color: 'primary-1',
    icon: 'i-mingcute:more-3-fill',
  },
  [DesktopQueueStatus.USING]: {
    label: '已分配',
    color: 'alerts-success',
    icon: 'i-material-symbols:check-circle',
  },
  [DesktopQueueHistoryStatus.CANCELED]: {
    color: 'primary-1',
    icon: 'i-material-symbols:error',
  },
  [DesktopQueueHistoryStatus.EXPIRED]: {
    color: 'alerts-error',
    icon: 'i-material-symbols:error',
  },
  [DesktopQueueHistoryStatus.REJECTED]: {
    color: 'alerts-error',
    icon: 'i-mingcute:close-circle-fill',
  },
}
</script>

<template>
  <div
    flex="~ items-center gap2px" p="y1 x2"
    text="sm grey-1" font-400
    :style="{
      backgroundColor: `var(--${requestStyle[status].color})`,
    }"
    whitespace-nowrap rounded-6 select-none
  >
    <div w4 h4 :class="requestStyle[status].icon" />
    <div
      v-text="
        requestStyle[status].label
        ?? desktopQueueStatusDescriptions[status as DesktopQueueStatus]
        ?? desktopQueueHistoryStatusDescriptions[status as DesktopQueueHistoryStatus]
      "
    />
  </div>
</template>
