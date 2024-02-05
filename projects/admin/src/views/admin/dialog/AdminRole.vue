<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import type { IRole, IUpsertRoleBodyDto, PermissionType } from 'zjf-types'
import RolePermission from './RolePermission.vue'

export type Type = 'add' | 'edit' | 'view'
interface AdminRole {
  name: string
  description: string
  permissions: PermissionType[]
}

interface Props {
  type?: Type
  role?: IRole
}

const props = defineProps<Props>()
const emits = defineEmits(['update:type', 'callback'])

const rolePermission = ref<HTMLElement>()

const { height } = useElementSize(rolePermission)

/** 对话框 */
const dialog = computed({
  get() {
    const { type, role } = props
    return type === 'add' || (!!type && !!role)
  },
  set() {
    emits('update:type', undefined)
  }
})
/** 是否只读 */
const readonly = computed(() => props.type === 'view')
/** 初始数据 */
const initData: AdminRole = {
  name: '',
  description: '',
  permissions: []
}
/** 管理员角色表单 */
const form = ref<AdminRole>(cloneDeep(initData))

watch(
  dialog,
  (newVal) => {
    if (newVal)
      init()
  },
)

/** 禁用提交 */
const disable = computed(() => !form.value.name)

/**
 * 初始化页面
 */
async function init() {
  const { type, role } = props
  if (type === 'add')
    form.value = cloneDeep(initData)
  else if (role) {
    form.value = {
      name: role.name,
      description: role.description ?? '',
      permissions: role.permissions?.map(v => v.name) ?? []
    }
  }
}

/**
 * 提交
 */
async function confirm() {
  if (disable.value)
    return

  const { type } = props
  const body: IUpsertRoleBodyDto = cloneDeep(form.value)
  if (type === 'edit')
    body.id = props.role?.id
  await upsertRoleApi(body)
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
    :title="type === 'add' ? '添加权限' : type === 'edit' ? '编辑权限' : '查看完整信息'"
    confirm-text="保存"
    :footer="!readonly" scroll
    :disable-confirm="disable"
    :wrapper-style="{
      width: '912px',
      maxWidth: '912px',
    }"
    @ok="confirm"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="form.name"
        label="权限名称"
        placeholder="请输入权限名称（10 字以内）"
        required
        :params="{
          rules: [
            (val: string) => validateAdminRoleName(val) || true
          ],
          readonly,
        }"
      />
      <ZInput
        v-model="form.description"
        label="描述"
        placeholder="请输入描述（200 字以内）"
        type="textarea"
        :params="{
          rules: [
            (val: string) => validateAdminRoleDesc(val) || true
          ],
          readonly,
        }"
      />
      <div flex="~ col gap4">
        <ZLabel label="权限" />
        <q-scroll-area
          p2 rounded-3 bg-grey-2
          :style="{ height: `${height + 16}px` }"
        >
          <RolePermission
            ref="rolePermission"
            v-model="form.permissions"
            :readonly="readonly"
          />
        </q-scroll-area>
      </div>
    </div>
  </ZDialog>
</template>

<style lang="scss">
.admin-role-dialog {
  .z-dialog__scrollarea {
    > .q-scrollarea__container >  .q-scrollarea__content {
      max-width: 100%;
    }
  }
}
</style>