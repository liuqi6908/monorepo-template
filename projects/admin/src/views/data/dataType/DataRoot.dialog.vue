<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import { pick, validateNameEn } from 'zjf-utils'
import type { IDataDirectory, ICreateRootBodyDto } from 'zjf-types'

export type Type = 'add' | 'edit'

interface Props {
  type?: Type
  dataRoot?: IDataDirectory
}

const props = defineProps<Props>()
const emits = defineEmits(['update:type', 'callback'])

/** 对话框 */
const dialog = computed({
  get() {
    const { type, dataRoot } = props
    return type === 'add' || (!!type && !!dataRoot)
  },
  set() {
    emits('update:type', undefined)
  }
})
/** 初始数据 */
const initData: ICreateRootBodyDto = {
  id: '',
  nameZH: '',
  nameEN: '',
  order: 1,
}
/** 数据资源表单 */
const form = ref<ICreateRootBodyDto>(cloneDeep(initData))

watch(
  dialog,
  (newVal) => {
    if (newVal)
      init()
  },
)

/** 禁用提交 */
const disable = computed(() => {
  const { id, nameZH, nameEN, order } = form.value
  return !!validateDataRootId(id)
    || !!validateDataRootNameZh(nameZH)
    || !!validateNameEn(nameEN)
    || typeof order === 'number' &&  (order < 1 || order > 9999)
})

/**
 * 初始化页面
 */
async function init() {
  const { type, dataRoot } = props
  if (type === 'add')
    form.value = cloneDeep(initData)
  else
    form.value = pick(dataRoot!, 'id', 'nameZH', 'nameEN', 'order')
}

/**
 * 提交
 */
async function confirm() {
  if (disable.value)
    return

  const { type } = props
  if (type === 'add')
    await createRootApi(form.value)
  else
    await updateRootApi(form.value.id, form.value)
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
        label="资源ID"
        placeholder="请输入资源ID"
        :required="type === 'add'"
        :params="{
          rules: [
            (val: string) => validateDataRootId(val) || true,
          ],
          readonly: type === 'edit',
        }"
      />
      <ZInput
        v-model="form.nameZH"
        label="中文名"
        placeholder="请输入资源中文名"
        required
        :params="{
          rules: [
            (val: string) => validateDataRootNameZh(val) || true,
          ],
        }"
      />
      <ZInput
        v-model="form.nameEN"
        label="英文名"
        placeholder="请输入资源英文名"
        required
        :params="{
          rules: [
            (val: string) => validateNameEn(val) || true,
          ],
        }"
      />
      <ZInput
        :model-value="form.order"
        label="排序字段"
        placeholder="请输入排序字段（1-9999）"
        type="number"
        @update:model-value="(val) => {
          const num = Math.floor(Number.parseFloat(val))
          if (Number.isNaN(num) || num <= 0)
            form.order = 1
          else if (num > 9999)
            form.order = 9999
          else
            form.order = num
        }"
      />
    </div>
  </ZDialog>
</template>
