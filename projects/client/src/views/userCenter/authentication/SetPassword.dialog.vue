<script lang="ts" setup>
import { Notify } from 'quasar'
import { validatePassword } from 'zjf-utils'

const props = defineProps<{
  modelValue?: boolean
}>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { getOwnProfile } = useUser()

/** 密码 */
const password = ref('')
/** 确认密码 */
const repeatPassword = ref('')

/** 禁用提交 */
const disable = computed(() => !!validatePassword(password.value) || password.value !== repeatPassword.value)

/**
 * 设置密码
 */
async function confirm() {
  if (disable.value)
    return

  const res = await updateOwnPasswordByOldPasswordApi({
    newPassword: password.value,
  })
  if (res) {
    Notify.create({
      message: '修改成功',
      type: 'success',
    })
    getOwnProfile(undefined, false)
  }
}
</script>

<template>
  <ZDialog
    v-model="value"
    title="设置密码"
    :wrapper-style="{
      width: '488px',
    }"
    footer
    confirm-text="保存"
    :disable-confirm="disable"
    @ok="confirm"
  >
    <div flex="~ col gap1" mb="-5">
      <slot />
      <ZInput
        v-model="password"
        label="密码"
        placeholder="请输入密码"
        password
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
        password
        :params="{
          rules: [
            (val: string) => val === password || '两次密码不一致'
          ],
          reactiveRules: true
        }"
      />
    </div>
  </ZDialog>
</template>
