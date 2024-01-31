<script lang="ts" setup>
import { Notify } from 'quasar'
import { PermissionType } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IDataRole } from 'zjf-types'

import UserRoleDialog from './dialog/UserRole.vue'
import type { Type } from './dialog/UserRole.vue'

const { adminRole } = useUser()

/** 是否可以编辑（添加、编辑、删除） */
const isEdit = computed(() => hasIntersection(
  adminRole.value ?? [],
  [
    PermissionType.DATA_PERMISSION_CREATE,
    PermissionType.DATA_PERMISSION_DELETE,
    PermissionType.DATA_PERMISSION_UPDATE,
  ],
))

/** 加载中 */
const loading = ref(false)
/** 用户角色弹窗类型 */
const dialogType = ref<Type>()
/** 用户角色弹窗id */
const dialogId = ref<string>()
/** 删除角色对话框 */
const deleteDialog = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<IDataRole>[]>([
  {
    name: 'name',
    label: '角色名称',
    field: 'name',
  },
  {
    name: 'description',
    label: '描述',
    field: 'description',
  },
  {
    name: 'sort',
    label: '角色排序',
    field: row => row.sort?.toString(),
  },
  {
    name: 'dataRole',
    label: '认证页面可选',
    field: row => row.select ? '是' : '否',
  },
  {
    name: 'action',
    label: '完整信息',
    field: 'id',
  },
])
/** 多选 */
const selected = ref<IDataRole[]>()

watch(
  dialogType,
  (newVal) => {
    if (!newVal || newVal === 'add')
      dialogId.value = undefined
  },
)

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
  queryRoleList()
})

/**
 * 查询用户角色列表
 */
async function queryRoleList() {
  loading.value = true

  try {
    rows.value = await getDataRoleListApi()
  }
  catch (_) {
    rows.value = []
  }
  finally {
    selected.value = undefined
    loading.value = false
  }
}

/**
 * 删除用户角色
 */
async function deleteRole() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchDeleteDataRoleApi(selected.value.map(v => v.id))
    Notify.create({
      type: 'success',
      message: '操作成功'
    })
  }
  finally {
    selected.value = undefined
    if (res)
      queryRoleList()
    else
      loading.value = false
  }
}
</script>

<template>
  <div flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div
      v-if="isEdit"
      flex="~ gap4"
    >
      <ZBtn
        v-if="adminRole?.includes(PermissionType.DATA_PERMISSION_CREATE)"
        label="添加角色"
        @click="dialogType = 'add'"
      >
        <template #left>
          <div w5 h5 i-mingcute:add-line />
        </template>
      </ZBtn>
      <ZBtn
        v-if="adminRole?.includes(PermissionType.DATA_PERMISSION_UPDATE)"
        label="编辑角色"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
        :disable="selected?.length !== 1"
        @click="() => {
          dialogType = 'edit'
          dialogId = selected?.[0].id
        }"
      >
        <template #left>
          <div w5 h5 i-mingcute:edit-2-line />
        </template>
      </ZBtn>
      <ZBtn
        v-if="adminRole?.includes(PermissionType.DATA_PERMISSION_DELETE)"
        label="删除角色"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
        :disable="!selected?.length"
        @click="deleteDialog = true"
      >
        <template #left>
          <div w5 h5 i-mingcute:delete-2-line />
        </template>
      </ZBtn>
    </div>

    <ZTable
      v-model:selected="selected"
      :rows="rows"
      :cols="cols"
      :params="{
        noDataLabel: '暂无用户角色记录',
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-last-column
    >
      <template #body-cell-action="{ value }">
        <q-td auto-width>
          <div
            text="sm primary-1" font-400
            cursor-pointer select-none
            @click="() => {
              dialogType = 'view'
              dialogId = value
            }"
          >
            查看完整信息
          </div>
        </q-td>
      </template>
    </ZTable>

    <!-- 删除角色 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除角色"
      footer
      @ok="deleteRole"
    >
      该操作将删除已选的用户角色，是否继续？
    </ZDialog>

    <!-- 添加、编辑、查看角色 -->
    <UserRoleDialog
      v-model:type="dialogType"
      :id="dialogId"
      @callback="queryRoleList"
    />
  </div>
</template>
