<script lang="ts" setup>
import { Notify } from 'quasar'
import { CodeAction, PhoneCodeAction } from 'zjf-types'
import { validatePassword, validateEmail, validatePhone } from 'zjf-utils'

const props = defineProps<{
  modelValue?: boolean
}>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { userInfo, isPhone } = useUser()

/** 新密码 */
const newPassword = ref('')
/** 旧密码 */
const oldPassword = ref('')
/** 验证码 */
const code = ref('')
/** 邮箱验证校验码 */
const bizId = ref('')

/** 修改方式（0: 邮箱验证码、1手机验证码、2旧密码） */
const type = ref(0)

/** 禁用提交 */
const disable = computed(() => (
  !!validatePassword(newPassword.value)
  || ((type.value === 0 || type.value === 1) && (code.value.length !== 6 || !bizId.value))
  || (type.value === 0 && !!validateEmail(userInfo.value?.email ?? ''))
  || (type.value === 1 && !!validatePhone(userInfo.value?.phone ?? ''))
  || (type.value === 2 && !!validatePassword(oldPassword.value))
))

/**
 * 修改密码
 */
async function confirm() {
  if (disable.value)
    return

  let res
  if (type.value === 0) {
    res = await updateOwnPasswordByEmailCodeApi({
      email: userInfo.value?.email!,
      code: code.value,
      bizId: bizId.value,
      password: newPassword.value,
    })
  }
  else if (type.value === 1) {
    res = await updateOwnPasswordByPhoneCodeApi({
      phone: userInfo.value?.phone!,
      code: code.value,
      bizId: bizId.value,
      password: newPassword.value,
    })
  }
  else {
    res = await updateOwnPasswordByOldPasswordApi({
      newPassword: newPassword.value,
      oldPassword: oldPassword.value,
    })
  }
  if (res) {
    Notify.create({
      message: '修改成功',
      type: 'success',
    })
  }
}

/**
 * 切换修改方式
 */
function changeType() {
  if (type.value === 0) {
    if (isPhone.value)
      type.value = 1
    else
      type.value = 2
  }
  else if (type.value === 1) {
    type.value = 2
  }
  else {
    type.value = 0
  }
}
</script>

<template>
  <ZDialog
    v-model="value"
    title="修改密码"
    :caption="`（通过${
      type === 0
        ? '邮箱验证码'
        : type === 1 ? '手机验证码': '原密码'
    }修改）`"
    :wrapper-style="{
      width: '488px',
    }"
    footer
    confirm-text="保存"
    :disable-confirm="disable"
    @ok="confirm"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="newPassword"
        label="新密码"
        placeholder="请输入新密码"
        password
        :params="{
          rules: [
            (val: string) => validatePassword(val) || true
          ]
        }"
      />
      <SMSInput
        v-if="type === 0 || type === 1"
        v-model="code"
        v-model:biz-id="bizId"
        :email="userInfo?.email"
        :phone="userInfo?.phone"
        :action="type ? PhoneCodeAction.CHANGE_PASSWORD : CodeAction.CHANGE_PASSWORD"
        :type="!type"
      />
      <ZInput
        v-else
        v-model="oldPassword"
        label="原密码"
        placeholder="请输入原密码"
        password
        :params="{
          rules: [
            (val: string) => validatePassword(val) || true
          ]
        }"
      />
      <div
        text="sm primary-1" self-end cursor-pointer
        @click="changeType"
      >
        切换{{
          type === 0 && isPhone
            ? '手机验证码'
            : type === 0 && !isPhone || type === 1
              ? '原密码' : '邮箱验证码'
        }}修改
      </div>
    </div>
  </ZDialog>
</template>
