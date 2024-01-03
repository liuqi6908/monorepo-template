<script lang="ts" setup>
import { VerificationStatus } from 'zjf-types'

type Status = VerificationStatus | 'other'

type VerifyStyle = Record<Status, {
  color: string
  label: string
  icon: string
}>

withDefaults(
  defineProps<{ status?: Status }>(),
  {
    status: 'other',
  },
)

/** 认证样式 */
const verifyStyle: VerifyStyle = {
  [VerificationStatus.APPROVED]: {
    color: 'alerts-success',
    label: '已认证',
    icon: 'i-material-symbols:check-circle',
  },
  [VerificationStatus.CANCELLED]: {
    color: 'primary-1',
    label: '已取消',
    icon: 'i-material-symbols:cancel',
  },
  [VerificationStatus.PENDING]: {
    color: 'alerts-warning',
    label: '审核中...',
    icon: 'i-material-symbols:alarm',
  },
  [VerificationStatus.REJECTED]: {
    color: 'alerts-error',
    label: '已驳回',
    icon: 'i-material-symbols:cancel',
  },
  other: {
    color: 'alerts-error',
    label: '未认证',
    icon: 'i-material-symbols:error',
  },
}
</script>

<template>
  <div
    flex="~ items-center gap2" px6 h12
    b="1px solid" text-base font-600
    :style="{
      borderColor: `var(--${verifyStyle[status].color})`,
      backgroundColor: `var(--${verifyStyle[status].color}-bg)`,
    }" whitespace-nowrap
  >
    认证状态：
    <div flex="~ items-center gap1">
      <div w6 h6 :style="{ color: `var(--${verifyStyle[status].color})` }" :class="verifyStyle[status].icon" />
      <div v-text="verifyStyle[status].label" />
    </div>
  </div>
</template>
