<script lang="ts" setup>
import { Notify } from 'quasar'
import { CodeAction } from 'zjf-types'
import { validatePassword } from 'zjf-utils'

const props = defineProps<{
  modelValue?: boolean
}>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { userInfo } = useUser()

/** 新密码 */
const newPassword = ref('')
/** 旧密码 */
const oldPassword = ref('')
/** 验证码 */
const code = ref('')
/** 邮箱验证校验码 */
const bizId = ref('')

/** 修改方式（true: 邮箱验证码、false: 旧密码） */
const type = ref(true)

/** 禁用提交 */
const disable = computed(() => (
  !!validatePassword(newPassword.value)
  || (type.value && (code.value.length !== 6 || !bizId.value))
  || (!type.value && !!validatePassword(oldPassword.value))
))

/**
 * 修改密码
 */
async function confirm() {
  if (disable.value)
    return

  let res
  if (type.value) {
    res = await updateOwnPasswordByEmailCodeApi({
      email: userInfo.value?.email!,
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
</script>

<template>
  <ZDialog
    v-model="value"
    title="修改密码"
    :caption="`（通过${type ? '邮箱验证码' : '原密码'}修改）`"
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
        v-if="type"
        v-model="code"
        v-model:biz-id="bizId"
        :email="userInfo?.email || ''"
        :action="CodeAction.CHANGE_PASSWORD"
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
        @click="type = !type"
      >
        切换{{ type ? '原密码' : '邮箱验证码' }}修改
      </div>
    </div>
  </ZDialog>
</template>
