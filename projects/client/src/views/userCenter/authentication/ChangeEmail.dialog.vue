<script lang="ts" setup>
import { Notify } from 'quasar'
import { CodeAction } from 'zjf-types'
import { validateEmail } from 'zjf-utils'

const props = defineProps<{
  modelValue?: boolean
}>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { getOwnProfile } = useUser()

/** 邮箱 */
const email = ref('')
/** 验证码 */
const code = ref('')
/** 邮箱验证校验码 */
const bizId = ref('')

/** 禁用提交 */
const disable = computed(() => (
  !!validateEmail(email.value)
  || code.value.length !== 6
  || !bizId.value
))

/**
 * 修改邮箱
 */
async function confirm() {
  if (disable.value)
    return

  const res = await updateOwnEmailApi({
    email: email.value,
    code: code.value,
    bizId: bizId.value,
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
    title="修改邮箱"
    :wrapper-style="{
      width: '488px',
    }"
    footer
    confirm-text="保存"
    :disable-confirm="disable"
    @ok="confirm"
  >
    <div flex="~ col gap1" mb="-5">
      <ZInput
        v-model="email"
        label="邮箱"
        placeholder="请输入邮箱"
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
        :action="CodeAction.BIND_EMAIL"
      />
    </div>
  </ZDialog>
</template>
