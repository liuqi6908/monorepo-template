<script lang="ts" setup>
import { DesktopQueueHistoryStatus, DesktopQueueStatus } from 'zjf-types'
import request from '~/assets/desktop/requestFlow.svg?raw'
import RequestDialog from './Dialog.vue'

const emits = defineEmits(['loading'])

const { width } = useWindowSize()
const { app } = useSysConfig()
const { requestStatus, queueLen, rejectReason, isAllocated, getDesktopRequest } = useDesktop()

/** 驳回对话框 */
const rejectDialog = ref(false)
/** 申请对话框 */
const requestDialog = ref(false)

onBeforeMount(async () => {
  emits('loading', true)
  try {
    await getDesktopRequest()
  }
  catch (e) {console.error(e);
  }
  finally {
    emits('loading', false)
  }
})

/**
 * 处理申请流程svg
 * 当调整window窗口大小时，对svg进行缩放
 */
const processSvg = computed(() => {
  const w = (width.value >= 1284 ? 1284 : width.value <= APP_MIN_WIDTH ? APP_MIN_WIDTH : width.value) - 64
  return request.replace('智能云科研平台', app.value?.name ?? '')
    .replace(/width="(\d+)"/, `width="${w}"`)
    .replace(/height="(\d+)"/, `height="${w / 1220 * 334}"`)
})
</script>

<template>
  <div w-limited-1 py10 flex="~ col gap10">
    <div v-html="processSvg" />
    <div
      p="y4 x6" flex="~ items-center justify-between gap4"
      bg="primary-1/8" text-lg font-600 min-h-20
    >
      <!-- 提示信息 -->
      <div
        flex-1
        :text="
          requestStatus === DesktopQueueStatus.PENDING
          || requestStatus === DesktopQueueStatus.QUEUEING
          ? 'center' : 'left'
        "
      >
        <!-- 未申请 -->
        <template v-if="!requestStatus">
          您已经通过身份认证，请点击右侧按钮申请云桌面。
          <template v-if="queueLen">
            注意：前面有
            <span text="#F99E34" v-text="`${queueLen} 人`" />
            正在排队。
          </template>
        </template>
        <!-- 待审核 -->
        <template v-else-if="requestStatus === DesktopQueueStatus.PENDING">
          您的云桌面使用申请正在审核中，请耐心等待
        </template>
        <!-- 排队中 -->
        <template v-else-if="requestStatus === DesktopQueueStatus.QUEUEING" >
          <template v-if="isAllocated">
            云桌面资源已被分配完毕，请耐心等待
          </template>
          <template v-else-if="queueLen">
            您正在排队中，前面有
            <span text="#F99E34" v-text="`${queueLen} 个`" />
            用户正在排队，请耐心等待
          </template>
          <template v-else>
            管理员正在为您创建云桌面，请耐心等待并留意邮件通知
          </template>
        </template>
        <!-- 使用中 -->
        <template v-else-if="requestStatus === DesktopQueueStatus.USING">
          您已经成功申请云桌面，前往
          <span text="#F99E34" v-text="'「 用户中心 / 我的桌面 」'" />
          查看
        </template>
        <!-- 已驳回 -->
        <template v-else-if="requestStatus === DesktopQueueHistoryStatus.REJECTED" text-left>
          您的申请已被驳回，点击查看
          <span
            underline="~ offset-2" cursor-pointer
            text-primary-1
            @click="rejectDialog = true"
          >
            驳回理由
          </span>
        </template>
        <!-- 已取消 -->
        <template v-else-if="requestStatus === DesktopQueueHistoryStatus.CANCELED">
          您的申请已取消，请重新提交
        </template>
        <!-- 已过期 -->
        <template v-else-if="requestStatus === DesktopQueueHistoryStatus.EXPIRED">
          您的云桌面已过期，请重新提交申请
        </template>
      </div>
      <RouterLink
        v-if="requestStatus === DesktopQueueStatus.USING"
        to="/userCenter/cloudDesktop"
      >
        <ZBtn label="前往云桌面" size="big" right />
      </RouterLink>
      <ZBtn
        v-else-if="
          requestStatus !== DesktopQueueStatus.PENDING
          && requestStatus !== DesktopQueueStatus.QUEUEING
        " size="big"
        :label="`${!requestStatus || '再次'}申请使用`"
        @click="requestDialog = true"
      />
    </div>

    <!-- 驳回对话框 -->
    <ZDialog v-model="rejectDialog" title="驳回理由">
      <div
        class="hide-scrollbar" break-all
        min-h-20 style="max-height: calc(100vh - 200px)"
        v-text="rejectReason || '暂无驳回理由'"
      />
    </ZDialog>

    <!-- 申请使用对话框 -->
    <RequestDialog v-model="requestDialog" />
  </div>
</template>
