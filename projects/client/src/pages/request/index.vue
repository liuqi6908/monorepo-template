<script setup lang="ts">
import { VerificationStatus } from 'zjf-types'
import bg from '~/assets/bg/desktop.webp'
import Request from '~/views/request/request/index.vue'
import Desktop from '~/views/request/desktop/index.vue'

const { isLogin, isVerify, verifyStatus, getOwnProfile, getVerify } = useUser()

/** 加载中 */
const loading = ref(false)

onBeforeMount(async () => {
  if (!isLogin.value)
    return

  loading.value = true
  try {
    await getOwnProfile()
    if (!isVerify.value)
      await getVerify()
  }
  finally {
    if (!isVerify.value)
      loading.value = false
  }
})
</script>

<template>
  <div>
    <Banner :img="bg" title="申请云桌面" />
    <div relative min-h-100>
      <ZLoading :value="loading" />
      <!-- 未登录 / 未认证 -->
      <Empty
        v-if="!isVerify"
        icon="verify"
        v-bind="
          !isLogin
            ? { label: '您还未登录系统', captions: '用户登录并通过认证后，才能申请使用' }
            : !verifyStatus
              ? { label: '您还未进行身份认证', captions: '用户认证通过后，才能申请使用' }
              : { label: '您的身份认证尚未通过审核', captions: '用户认证通过后，才能申请使用' }
        "
      >
        <div mt4 flex="~ row items-center gap8">
          <VerifyStatus v-if="isLogin && verifyStatus" :status="verifyStatus" />
          <RouterLink
            v-if="!isLogin || verifyStatus !== VerificationStatus.PENDING"
            :to="!isLogin ? '/auth/login' : '/userCenter/authentication'"
          >
            <ZBtn
              px="14.5!" size="big" right
              :label="!isLogin ? '前往登录' : '前往认证'"
            />
          </RouterLink>
        </div>
      </Empty>
      <!-- 已认证 -->
      <template v-else>
        <!-- 申请使用云桌面 -->
        <Request @loading="val => loading = val" />
        <!-- 云桌面 -->
        <Desktop />
      </template>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
