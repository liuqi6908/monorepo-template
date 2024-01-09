<script setup lang="ts">
import { DesktopQueueStatus, DesktopQueueHistoryStatus, VerificationStatus } from 'zjf-types'
import DesktopOperate from '~/views/userCenter/cloudDesktop/DesktopOperate.vue'
import DesktopInfo from '~/views/userCenter/cloudDesktop/DesktopInfo.vue'

const { isVerify, verifyStatus, getOwnProfile, getVerify } = useUser()
const { requestStatus, queueLen, rejectReason, getDesktopRequest, getVmInfo } = useDesktop()

/** 加载中 */
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  try {
    await getOwnProfile()
    if (!isVerify.value)
      await getVerify()
    else
      await getDesktopRequest()
    if (requestStatus.value === DesktopQueueStatus.USING)
      await getVmInfo()
  }
  finally {
    loading.value = false
  }
})

/** 未申请空状态提示文字 */
const emptyLabel = computed(() => {
  const status = requestStatus.value
  if (!status)
    return '您还未申请云桌面'
  if (status === DesktopQueueStatus.PENDING)
    return '您的云桌面使用申请正在审核中，请耐心等待'
  if (status === DesktopQueueStatus.QUEUEING) {
    if (queueLen.value)
      return `您正在排队中，前面有 ${queueLen.value}个 用户正在排队，请耐心等待`
    else
      return '管理员正在为您创建云桌面，请耐心等待并留意邮件通知'
  }
  if (status === DesktopQueueHistoryStatus.REJECTED)
    return '您的申请已被驳回'
  if (status === DesktopQueueHistoryStatus.CANCELED)
    return '您的申请已取消'
  if (status === DesktopQueueHistoryStatus.EXPIRED)
    return '您的云桌面已过期'
})
</script>

<template>
  <div relative min-h-100>
    <ZLoading :value="loading" />
    <!-- 未认证 -->
    <Empty
      v-if="!isVerify"
      icon="verify"
      :label="!verifyStatus ? '您还未进行身份认证' : '您的身份认证尚未通过审核'"
      captions="用户认证通过后，才能申请使用"
    >
      <div mt4 flex="~ row items-center gap8">
        <VerifyStatus v-if="verifyStatus" :status="verifyStatus" />
        <RouterLink
          v-if="verifyStatus !== VerificationStatus.PENDING"
          to="/userCenter/authentication?verify"
        >
          <ZBtn
            px="14.5!" size="big" right
            label="前往认证"
          />
        </RouterLink>
      </div>
    </Empty>
    <!-- 未申请 -->
    <Empty
      v-else-if="requestStatus !== DesktopQueueStatus.USING"
      icon="desktop"
      :label="emptyLabel"
    >
      <div flex="~ col items-center gap6" w-full>
        <div
          v-if="requestStatus === DesktopQueueHistoryStatus.REJECTED"
          p4 bg-grey-2 w-full max-w-180 break-all
          v-text="`驳回理由：${rejectReason}`"
        />
        <RouterLink
          v-if="
            requestStatus !== DesktopQueueStatus.PENDING
            && requestStatus !== DesktopQueueStatus.QUEUEING
          "
          to="/request"
          mt4
        >
          <ZBtn
            w53 size="big" right
            :label="`${requestStatus ? '重新' : ''}前往申请`"
          />
        </RouterLink>
      </div>
    </Empty>
    <!-- 我云桌面 -->
    <div v-else flex="~ col gap10">
      <DesktopOperate @loading="val => loading = val" />
      <DesktopInfo />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  :deep(> div) {
    width: 100%;
  }
}
</style>

<route lang="yaml">
meta:
  layout: userCenter
</route>
