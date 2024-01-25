<script lang="ts" setup>
import { FileExportLargeStatus, fileExportLargeStatusDescriptions } from 'zjf-types'

type ExportStyle = Record<FileExportLargeStatus, {
  color: string
  icon: string
}>

interface Props {
  status: FileExportLargeStatus
  disable?: boolean
}

defineProps<Props>()

/** 外发状态样式 */
const exportStyle: ExportStyle = {
  [FileExportLargeStatus.APPROVED]: {
    color: 'alerts-success',
    icon: 'i-material-symbols:check-circle',
  },
  [FileExportLargeStatus.REJECTED]: {
    color: 'alerts-error',
    icon: 'i-material-symbols:cancel',
  },
  [FileExportLargeStatus.PENDING]: {
    color: 'alerts-warning',
    icon: 'i-mdi:minus-circle',
  },
}
</script>

<template>
  <div
    flex="~ items-center gap2px" p="y1 x2"
    text="base grey-1" font-400
    :style="{
      backgroundColor: disable ? 'var(--grey-4)' : `var(--${exportStyle[status].color})`,
    }"
    whitespace-nowrap rounded-6 select-none
  >
    <div w4 h4 :class="exportStyle[status].icon" />
    <div v-text="fileExportLargeStatusDescriptions[status]" />
  </div>
</template>
