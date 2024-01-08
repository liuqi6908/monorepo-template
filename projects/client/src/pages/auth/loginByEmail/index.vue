<script setup lang="ts">
import { validateEmail } from 'zjf-utils'
import { CodeAction } from 'zjf-types'
import type { ILoginByEmailCodeBodyDto } from 'zjf-types'

const { loading, loginByEmailCode } = useUser()

/** 邮箱 */
const email = ref('')
/** 验证码 */
const code = ref('')
/** 邮箱验证校验码 */
const bizId = ref('')

/** 禁用提交 */
const disable = computed(() => (
  loading.value
  || !!validateEmail(email.value)
  || code.value.length !== 6
  || !bizId.value
))

/** 提交表单 */
const formArg = computed<ILoginByEmailCodeBodyDto>(() => {
  return {
    email: email.value,
    code: code.value,
    bizId: bizId.value,
  }
})
</script>

<template>
  <div flex="~ col gap14">
    <h2 text-center relative>
      <RouterLink
        :to="{
          path: '/auth/login'
        }"
      >
        <div absolute-y-center left-0 text="xl grey-1" i-mingcute:left-line />
      </RouterLink>
      验证码登录
    </h2>
    <div flex="~ col gap5">
      <div flex="~ col gap1">
        <ZInput
          v-model="email"
          label="邮箱"
          placeholder="请输入邮箱"
          dark
          :params="{
            rules: [
              (val: string) => validateEmail(val) || true
            ]
          }"
        />
        <SMSInput
          v-model="code"
          v-model:biz-id="bizId"
          :email="email"
          :action="CodeAction.LOGIN"
          dark
          @keydown.enter="loginByEmailCode(formArg)"
        />
      </div>
      <ZBtn
        size="big"
        color="grey-1"
        text-color="primary-1"
        label="登录"
        :disable="disable"
        @click="loginByEmailCode(formArg)"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
