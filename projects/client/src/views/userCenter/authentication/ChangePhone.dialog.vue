<script lang="ts" setup>
import { Notify } from 'quasar'
import { PhoneCodeAction } from 'zjf-types'
import { validatePhone } from 'zjf-utils'

const props = defineProps<{
  modelValue?: boolean
}>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { userInfo, getOwnProfile } = useUser()

/** 手机号 */
const phone = ref('')
/** 验证码 */
const code = ref('')
/** 邮箱验证校验码 */
const bizId = ref('')

/** 禁用提交 */
const disable = computed(() => (
  !!validatePhone(phone.value)
  || code.value.length !== 6
  || !bizId.value
))

/**
 * 修改手机号
 */
async function confirm() {
  if (disable.value)
    return

  const res = await updateOwnPhoneApi({
    phone: phone.value,
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
    :title="`${userInfo?.email ? '修改' : '设置'}手机号`"
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
        v-model="phone"
        label="手机号"
        placeholder="请输入手机号"
        :params="{
          rules: [
            (val: string) => validatePhone(val) || true
          ]
        }"
      />
      <SMSInput
        v-model="code"
        v-model:biz-id="bizId"
        :phone="phone"
        :action="PhoneCodeAction.BIND_PHONE"
        :type="false"
      />
    </div>
  </ZDialog>
</template>
