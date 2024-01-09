<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { VerificationStatus } from 'zjf-types'
import { hideSensitiveInfo } from 'zjf-utils'
import ChangeEmailDialog from '~/views/userCenter/authentication/ChangeEmail.dialog.vue'
import ChangePasswordDialog from '~/views/userCenter/authentication/ChangePassword.dialog.vue'
import SetPasswordDialog from '~/views/userCenter/authentication/SetPassword.dialog.vue'
import VerificationDialog from '~/views/userCenter/authentication/Verification.dialog.vue'

const { query } = useRoute()
const $router = useRouter()
const { userInfo, latestVerify, verifyStatus, getOwnProfile, getVerify } = useUser()

/** 修改邮箱对话框 */
const changeEmail = ref(false)
/** 修改密码对话框 */
const changePassword = ref(false)
/** 设置密码对话框 */
const setPassword = ref(false)

/** 加载中 */
const loading = ref(false)
/** 基础信息 */
const baseInfo = computed(() => ({
  account: {
    label: '用户名',
    caption: '可用于登录平台',
    val: userInfo.value?.account,
    active: undefined,
  },
  email: {
    label: '邮箱',
    caption: '可用于接收平台信息',
    val: hideSensitiveInfo(userInfo.value?.email),
    active: () => changeEmail.value = true,
  },
  password: {
    label: '密码',
    caption: '设置密码以确保账户安全',
    val: userInfo.value?.password ? '********' : '',
    active: () => {
      if (userInfo.value?.password)
        changePassword.value = true
      else
        setPassword.value = true
    },
  },
}))
/** 认证信息 */
const authInfo = computed(() => {
  const obj = latestVerify.value
  return {
    school: {
      label: '学校',
      val: obj?.school,
    },
    college: {
      label: '学院',
      val: obj?.college,
    },
    number: {
      label: '学号/工号',
      val: obj?.number,
    },
    name: {
      label: '真实姓名',
      val: hideSensitiveInfo(obj?.name),
    },
    idCard: {
      label: '身份证',
      val: hideSensitiveInfo(obj?.idCard),
    },
    dataRole: {
      label: '用户类型',
      val: obj?.dataRole,
    },
  }
})

/** 认证对话框 */
const verifyDialog = ref(false)

onBeforeMount(async () => {
  loading.value = true
  try {
    await getOwnProfile()
    await getVerify()
  }
  finally {
    if (Object.keys(query).find(v => v === 'verify') && isClient) {
      nextTick(() => {
        const el = document.querySelector('.verify-status')
        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })
        }
        verifyDialog.value = true
        $router.replace({ query: {} })
      })
    }
    loading.value = false
  }
})

/**
 * 取消认证
 */
async function cancelAuth() {
  const id = latestVerify.value?.id
  if (!id)
    return

  loading.value = true
  try {
    const res = await cancelVerificationApi(id)
    if (res) {
      await getOwnProfile()
      await getVerify()
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div flex="~ col gap20" relative>
    <ZLoading :value="loading" />
    <div flex="~ col gap14">
      <!-- 基础信息 -->
      <div flex="~ col gap6">
        <h4>
          基础信息
        </h4>
        <div flex="~ col gap8">
          <div
            v-for="(item, index) in baseInfo"
            :key="index"
            flex="~ items-end gap10"
          >
            <ReadonlyInput
              :model-value="item.val"
              :label="item.label"
              :caption="`（${item.caption}）`"
              flex-1 w0
            />
            <div w20>
              <ZBtn
                v-if="item.active"
                :label="item.val ? '修改' : '设置'" size="big"
                text-color="primary-1"
                :params="{
                  outline: true,
                }"
                @click="item.active"
              />
            </div>
          </div>
        </div>
      </div>
      <div h1px bg-grey-3 />
      <!-- 认证信息 -->
      <div flex="~ col gap6">
        <h4>
          认证信息
        </h4>
        <div flex="~ wrap" gap="x10 y8" lg="gap-x-20">
          <ReadonlyInput
            v-for="(item, index) in authInfo"
            :key="index"
            class="auth-info"
            :model-value="item.val"
            :label="item.label"
            w-full
          />
        </div>
      </div>
    </div>
    <!-- 认证状态 -->
    <div flex="~ col gap6" class="verify-status">
      <div flex="~ justify-center gap8">
        <VerifyStatus :status="verifyStatus" />
        <ZBtn
          v-if="verifyStatus !== VerificationStatus.PENDING && verifyStatus !== VerificationStatus.APPROVED"
          label="前往认证" right size="big" w53
          @click="verifyDialog = true"
        />
        <ZBtn
          v-else-if="verifyStatus === VerificationStatus.PENDING"
          label="取消认证" size="big" w53
          :disable="!latestVerify?.id"
          @click="cancelAuth"
        >
          <template #icon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825 4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267 15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667 22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175 19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="white"/>
            </svg>
          </template>
        </ZBtn>
      </div>
      <!-- 驳回理由 -->
      <div
        v-if="verifyStatus === VerificationStatus.REJECTED"
        p4 flex="~ col gap2" bg-grey-2
      >
        <div font-600>
          驳回理由
        </div>
        <div break-all v-text="latestVerify?.rejectReason" />
      </div>
    </div>

    <!-- 修改邮箱对话框 -->
    <ChangeEmailDialog v-model="changeEmail" />
    <!-- 修改密码对话框 -->
    <ChangePasswordDialog v-model="changePassword" />
    <!-- 设置密码对话框 -->
    <SetPasswordDialog v-model="setPassword" />
    <!-- 认证申请对话框 -->
    <VerificationDialog v-model="verifyDialog" />
  </div>
</template>

<style lang="scss" scoped>
.auth-info {
  @media (min-width: 760px) {
    width: calc(50% - 20px);
  }
  @media (min-width: 900px) {
    width: calc(50% - 40px);
  }
}
</style>

<route lang="yaml">
meta:
  layout: userCenter
</route>
