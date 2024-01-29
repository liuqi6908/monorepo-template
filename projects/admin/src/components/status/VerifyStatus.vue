<script lang="ts" setup>
import { VerificationStatus, verificationStatusDescriptions } from 'zjf-types'

type Status = VerificationStatus | 'other'

type VerifyStyle = Record<Status, {
  color: string
  icon: string
}>

withDefaults(
  defineProps<{ status?: Status }>(),
  {
    status: 'other',
  },
)

/** 认证状态样式 */
const verifyStyle: VerifyStyle = {
  [VerificationStatus.APPROVED]: {
    color: 'alerts-success',
    icon: 'i-material-symbols:check-circle',
  },
  [VerificationStatus.REJECTED]: {
    color: 'alerts-error',
    icon: 'i-material-symbols:cancel',
  },
  [VerificationStatus.PENDING]: {
    color: 'alerts-warning',
    icon: 'i-mdi:minus-circle',
  },
  [VerificationStatus.CANCELLED]: {
    color: 'primary-1',
    icon: 'i-material-symbols:error',
  },
  other: {
    color: 'primary-1',
    icon: 'i-material-symbols:error',
  },
}
</script>

<template>
  <div
    flex="~ items-center gap2px" p="y1 x2"
    text="sm grey-1" font-400
    :style="{
      backgroundColor: `var(--${verifyStyle[status].color})`,
    }"
    whitespace-nowrap rounded-6 select-none
  >
    <div w4 h4 :class="verifyStyle[status].icon" />
    <div v-text="status === 'other' ? '未认证' : verificationStatusDescriptions[status]" />
  </div>
</template>
