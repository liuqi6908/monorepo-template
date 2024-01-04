<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useIntervalFn, useVModel } from '@vueuse/core'
import { Notify } from 'quasar'
import type { CodeAction } from 'zjf-types'
import { pick, validateEmail } from 'zjf-utils'
import { sendCodeApi } from '../../api/email'
import ZInput from './ZInput.vue'
import type { ZInputProps } from './ZInput.vue'

interface SMSInputProps {
  modelValue: string
  email: string
  action: CodeAction
  dark?: boolean
  params?: Omit<ZInputProps, 'modelValue' | 'dark'>
}

const props = defineProps<SMSInputProps>()
const emits = defineEmits(['update:modelValue', 'update:bizId'])

const value = useVModel(props, 'modelValue')

/** 倒计时 */
const interval = ref(0)
/** 加载中 */
const loading = ref(false)
/** 禁用发送 */
const disable = computed(() => loading.value || !!validateEmail(props.email) || interval.value > 0)

const { pause, resume } = useIntervalFn(() => {
  interval.value--
  if (interval.value <= 0)
    pause()
}, 1000)

/**
 * 获取验证码
 */
async function getSmsCode() {
  if (disable.value)
    return

  loading.value = true
  try {
    const res = await sendCodeApi(pick(props, 'email', 'action'))
    if (res) {
      Notify.create({
        type: 'success',
        message: '发送成功',
      })
      emits('update:bizId', res.bizId)
      interval.value = 60
    }
  }
  catch (_) {
    interval.value = 10
  }
  finally {
    loading.value = false
    resume()
  }
}
</script>

<template>
  <ZInput
    v-model="value"
    label="邮箱验证"
    placeholder="请输入验证码"
    :params="{
      rules: [
        (val: string) => val.length === 6 || '请输入 6 位验证码'
      ]
    }"
    :dark="dark"
    v-bind="params"
  >
    <template #append>
      <q-btn
        unelevated square
        min-h="auto!"
        w26 h9 text-base font-400 p0
        :bg="dark ? 'white-2' : 'primary-1/12'"
        :text-color="dark ? 'grey-1' : 'primary-1'"
        :label="interval > 0 ? `${interval}秒后再试` : '发送验证码'"
        :disable="disable"
        @click="getSmsCode"
      />
    </template>
  </ZInput>
</template>
