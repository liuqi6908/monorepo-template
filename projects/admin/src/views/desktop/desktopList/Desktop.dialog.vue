<script lang="ts" setup>
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import { pick } from 'zjf-utils'
import type { IDesktop, ICreateDesktopBodyDto } from 'zjf-types'

export type Type = 'add' | 'edit'

interface Props {
  type?: Type
  desktop?: IDesktop
}

const props = defineProps<Props>()
const emits = defineEmits(['update:type', 'callback'])

/** 对话框 */
const dialog = computed({
  get() {
    const { type, desktop } = props
    return type === 'add' || (!!type && !!desktop)
  },
  set() {
    emits('update:type', undefined)
  }
})
/** 初始数据 */
const initData: ICreateDesktopBodyDto = {
  id: '',
  name: '',
  internalIp: '',
  accessUrl: '',
  account: '',
  password: '',
  expiredAt: new Date(),
}
/** 云桌面表单 */
const form = ref<ICreateDesktopBodyDto>(cloneDeep(initData))

watch(
  dialog,
  (newVal) => {
    if (newVal)
      init()
  },
)

/** 禁用提交 */
const disable = computed(() => {
  const { id, name, internalIp, accessUrl, account, password, expiredAt } = form.value
  return !id || !name || !internalIp || !accessUrl
  || !account || !password || !expiredAt
})

/**
 * 初始化页面
 */
async function init() {
  const { type, desktop } = props
  if (type === 'add')
    form.value = cloneDeep(initData)
  else
    form.value = pick(desktop!, 'id', 'name', 'internalIp', 'accessUrl', 'account', 'password', 'expiredAt')
}

/**
 * 提交
 */
async function confirm() {
  if (disable.value)
    return

  const { type } = props
  if (type === 'add')
    await createDesktopApi(form.value)
  else
    await updateDesktopApi(form.value.id, form.value)
  Notify.create({
    type: 'success',
    message: `${type === 'add' ? '添加' : '编辑'}成功`,
  })
  emits('callback')
}
</script>

<template>
  <ZDialog
    v-model="dialog"
    :title="type === 'add' ? '添加' : '编辑'"
    confirm-text="保存"
    footer
    :disable-confirm="disable"
    @ok="confirm"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="form.id"
        label="云桌面ID"
        placeholder="请输入云桌面ID"
        :required="type === 'add'"
        :params="{
          rules: [
            (val: string) => !val ? '请输入云桌面ID' : true,
          ],
          readonly: type === 'edit',
        }"
      />
      <ZInput
        v-model="form.name"
        label="云桌面名称"
        placeholder="请输入云桌面名称"
        required
        :params="{
          rules: [
            (val: string) => !val ? '请输入云桌面名称' : true,
          ],
        }"
      />
      <ZInput
        v-model="form.internalIp"
        label="IP地址"
        placeholder="请输入IP地址"
        required
        :params="{
          rules: [
            (val: string) => !val ? '请输入IP地址' : true,
          ],
        }"
      />
      <ZInput
        v-model="form.accessUrl"
        label="访问地址"
        placeholder="请输入访问地址"
        required
        :params="{
          rules: [
            (val: string) => !val ? '请输入访问地址' : true,
          ],
        }"
      />
      <ZInput
        v-model="form.account"
        label="账号"
        placeholder="请输入账号"
        required
        :params="{
          rules: [
            (val: string) => !val ? '请输入账号' : true,
          ],
        }"
      />
      <ZInput
        v-model="form.password"
        label="密码"
        placeholder="请输入密码"
        required password
        :params="{
          rules: [
            (val: string) => !val ? '请输入密码' : true,
          ],
        }"
      />
      <ZDate
        :model-value="form.expiredAt ? moment(form.expiredAt).format('YYYY-MM-DD') : ''"
        :reset-btn="false"
        :input-params="{
          label: '到期时间',
          placeholder: '请选择到期时间',
          required: true,
          params: {
            readonly: true,
            rules: [
              (val: Date) => !val ? '请选择到期时间' : true,
            ],
          }
        }"
        @update:model-value="val => form.expiredAt = new Date(val)"
      />
    </div>
  </ZDialog>
</template>
