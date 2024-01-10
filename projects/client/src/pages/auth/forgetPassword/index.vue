<script setup lang="ts">
import { validateEmail, validatePassword } from 'zjf-utils'
import { CodeAction } from 'zjf-types'
import type { IUpdatePasswordByEmailCodeBodyDto } from 'zjf-types'

const { loading, updatePasswordByEmailCode } = useUser()

/** 邮箱 */
const email = ref('')
/** 验证码 */
const code = ref('')
/** 邮箱验证校验码 */
const bizId = ref('')
/** 密码 */
const password = ref('')
/** 确认密码 */
const repeatPassword = ref('')

/** 禁用提交 */
const disable = computed(() => {
  return loading.value
    || !!validateEmail(email.value)
    || code.value.length !== 6
    || !bizId.value
    || !!validatePassword(password.value)
    || password.value !== repeatPassword.value
})

/** 提交表单 */
const formArg = computed<IUpdatePasswordByEmailCodeBodyDto>(() => {
  return {
    email: email.value,
    code: code.value,
    bizId: bizId.value,
    password: password.value
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
      邮箱找回
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
          :action="CodeAction.CHANGE_PASSWORD"
          dark
        />
        <ZInput
          v-model="password"
          label="密码"
          placeholder="请输入密码"
          dark password
          :params="{
            rules: [
              (val: string) => validatePassword(val) || true
            ]
          }"
        />
        <ZInput
          v-model="repeatPassword"
          label="确认密码"
          placeholder="请确认密码"
          dark password
          :params="{
            rules: [
              (val: string) => val === password || '两次密码不一致'
            ],
            reactiveRules: true
          }"
        />
      </div>
      <ZBtn
        size="big"
        color="grey-1"
        text-color="primary-1"
        label="完成"
        :disable="disable"
        @click="updatePasswordByEmailCode(formArg)"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
