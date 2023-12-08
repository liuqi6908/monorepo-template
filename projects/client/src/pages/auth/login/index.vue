<script setup lang="ts">
import { validateEmail, validatePassword } from 'zjf-utils'

const { useLogin } = useUser()

const userCode = ref('')
const password = ref('')
const acceptObj = reactive({
  password: false,
})

function passwordRule(val: string) {
  return validatePassword(val) || true
}

const logArg = computed(() => {
  return {
    password: password.value,
    [validateEmail(userCode.value) ? 'account' : 'email']: userCode.value
  }
})

const disable = computed(() => !userCode.value || Object.values(acceptObj).includes(false))

/**
 * 按下回车键，登录
 */
function handleEnter() {
  if (!disable.value)
    useLogin(logArg.value)
}
</script>

<template>
  <div>
    <header flex-center mb-12 font-600 text-7 v-text="'登录'" />

    <div mb-2 v-text="'账号 / 邮箱'" />
    <UserCodeInput
      v-model:userCode="userCode"
      label="请输入账号/邮箱"
    />

    <div mb-2 mt-6 v-text="'密码'" />
    <PasswordInput
      v-model:password="password"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.password = val"
      @keydown.enter="handleEnter()"
    />

    <RouterLink text-grey-1 font-400 mt-2 :to="{ path: 'forgetPassword' }" v-text="'忘记密码？'" />

    <client-only>
      <Btn color="primary-1" mt-20 h="12!" bg-color="grey-1" :disable="disable" @click="handleEnter">
        <div text-base font-600>登录</div>
      </Btn>
    </client-only>

    <div flex-center mt-4 font-400>
      <span text-white-7>没有账号？</span>
      <RouterLink text-grey-1 :to="{ path: 'signup' }" v-text="'立即注册'" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
