<script lang="ts" setup>
type Status = 'assigned' | 'stopped' | 'waiting'

type DesktopStyle = Record<Status, {
  label?: string
  color: string
  icon: string
}>

defineProps<{ status: Status }>()

/** 云桌面状态样式 */
const desktopStyle: DesktopStyle = {
  assigned: {
    label: '已分配',
    color: 'alerts-success',
    icon: 'i-material-symbols:check-circle',
  },
  waiting: {
    label: '待分配',
    color: 'primary-1',
    icon: 'i-mingcute:more-3-fill',
  },
  stopped: {
    label: '已停用',
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
      backgroundColor: `var(--${desktopStyle[status].color})`,
    }"
    whitespace-nowrap rounded-6 select-none
  >
    <div w4 h4 :class="desktopStyle[status].icon" />
    <div v-text="desktopStyle[status].label" />
  </div>
</template>
