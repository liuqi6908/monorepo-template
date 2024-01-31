<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import { omit } from 'zjf-utils'
import type { IDataRole, IUpsertDataRoleBodyDto } from 'zjf-types'
import RolePermission from './RolePermission.vue'

export type Type = 'add' | 'edit' | 'view'
type DataRole = Omit<IDataRole, 'id'>

interface Props {
  type?: Type
  id?: string
}

const props = defineProps<Props>()
const emits = defineEmits(['update:type', 'callback'])

/** 对话框 */
const dialog = computed({
  get() {
    const { type, id } = props
    return type === 'add' || (!!type && !!id)
  },
  set() {
    emits('update:type', undefined)
  }
})
/** 加载中 */
const loading = ref(false)
/** 是否只读 */
const readonly = computed(() => props.type === 'view')
/** 初始数据 */
const initData: DataRole = {
  name: '',
  sort: 1,
  select: true,
  viewDirectories: [],
  downloadDirectories: []
}
/** 用户角色表单 */
const form = ref<DataRole>(cloneDeep(initData))

watch(
  dialog,
  (newVal) => {
    if (newVal)
      init()
  },
)

/** 禁用提交 */
const disable = computed(() => {
  const { name, description, sort } = form.value
  return !!validateDataRoleName(name)
    || !!validateDataRoleDesc(description)
    || typeof sort === 'number' &&  (sort < 1 || sort > 9999)
})

/**
 * 初始化页面
 */
async function init() {
  const { type, id } = props
  loading.value = true
  if (type === 'add')
    form.value = cloneDeep(initData)
  else
    form.value = await queryDataRoleDetailsApi(id!)
  loading.value = false
}

/**
 * 提交
 */
async function confirm() {
  if (disable.value)
    return

  const { type } = props
  const body: IUpsertDataRoleBodyDto = {
    ...omit(cloneDeep(form.value), 'viewDirectories', 'downloadDirectories'),
    viewableDirectoryIds: form.value.viewDirectories?.map(item => item.id),
    downloadableDirectoryIds: form.value.downloadDirectories?.map(item => item.id)
  }
  await upsertDataRoleApi(body)
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
    class="data-role-dialog"
    :title="type === 'add' ? '添加角色' : type === 'edit' ? '编辑角色' : '查看完整信息'"
    confirm-text="保存"
    :footer="!readonly"
    :loading="loading"
    scroll
    :disable-confirm="disable"
    :params="{
      fullWidth: true,
      fullHeight: true,
    }"
    @ok="confirm"
  >
    <div flex="~ col gap8">
      <div flex="~ col gap6">
        <SubLabel label="基本信息" />
        <div flex="~ col gap1">
          <ZInput
            v-model="form.name"
            label="角色名称"
            placeholder="请输入角色名称（10 字以内）"
            label-position="left"
            required
            :params="{
              rules: [
                (val: string) => validateDataRoleName(val) || true
              ],
              readonly,
            }"
          />
          <ZInput
            v-model="form.description"
            label="角色描述"
            placeholder="请输入角色描述（200 字以内）"
            label-position="left"
            aligning
            type="textarea"
            :params="{
              rules: [
                (val: string) => validateDataRoleDesc(val) || true
              ],
              readonly,
            }"
          />
          <ZInput
            :model-value="form.sort"
            label="角色排序"
            placeholder="请输入角色排序（1-9999）"
            label-position="left"
            aligning
            type="number"
            :params="{
              readonly,
            }"
            @update:model-value="(val) => {
              const num = Math.floor(Number.parseFloat(val))
              if (Number.isNaN(num) || num <= 0)
                form.sort = 1
              else if (num > 9999)
                form.sort = 9999
              else
                form.sort = num
            }"
          />
          <div flex="~ items-center gap2" mt4>
            <ZLabel
              label="认证页面可选"
              aligning w34
            />
            <div flex="~ 1 gap5" w0 relative right-2>
              <ZRadio
                :model-value="form.select?.toString()"
                val="true"
                label="是"
                @update:model-value="() => {
                  if (!readonly)
                    form.select = true
                }"
              />
              <ZRadio
                :model-value="form.select?.toString()"
                val="false"
                label="否"
                @update:model-value="() => {
                  if (!readonly)
                    form.select = false
                }"
              />
            </div>
          </div>
        </div>
      </div>
      <div flex="~ col gap6">
        <SubLabel label="角色权限" />
        <div
          p4 rounded-3 bg-grey-2
          flex="~ col gap6"
        >
          <RolePermission
            v-model="form.viewDirectories"
            label="访问权限"
            :readonly="readonly"
          />
          <div h1px bg-grey-3 />
          <RolePermission
            v-model="form.downloadDirectories"
            label="下载权限"
            :readonly="readonly"
          />
        </div>
      </div>
    </div>
  </ZDialog>
</template>

<style lang="scss">
.data-role-dialog {
  .z-dialog__scrollarea {
    > .q-scrollarea__container >  .q-scrollarea__content {
      max-width: 100%;
    }
  }
}
</style>