<script lang="ts" setup>
import { Notify } from 'quasar'
import { PermissionType } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IRole } from 'zjf-types'

import AdminRoleDialog from './dialog/AdminRole.vue'
import type { Type } from './dialog/AdminRole.vue'

const { adminRole } = useUser()
const { getMenu } = useRole()

/** 是否可以编辑（添加、删除） */
const isEdit = computed(() => hasIntersection(
  adminRole.value ?? [],
  [
    PermissionType.ROLE_CREATE,
    PermissionType.ROLE_DELETE,
  ],
))

/** 加载中 */
const loading = ref(false)
/** 管理权限弹窗类型 */
const dialogType = ref<Type>()
/** 管理权限 */
const role = ref<IRole>()
/** 删除权限对话框 */
const deleteDialog = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<IRole>[]>([
  {
    name: 'name',
    label: '名称',
    field: 'name',
  },
  {
    name: 'description',
    label: '描述',
    field: 'description',
  },
  {
    name: 'dataRole',
    label: '权限',
    field: row => getMenu(row.permissions?.map(v => v.name)).map(v => v.name).join('、'),
  },
  {
    name: 'info',
    label: '完整信息',
    field: 'id',
  },
])
/** 多选 */
const selected = ref<IRole[]>()

watch(
  dialogType,
  (newVal) => {
    if (!newVal || newVal === 'add')
      role.value = undefined
  },
)

onBeforeMount(() => {
  if (adminRole.value?.includes(PermissionType.ROLE_UPDATE)) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  cols.forEach(v => v.align = 'center')
  queryRoleList()
})

/**
 * 查询管理权限列表
 */
async function queryRoleList() {
  loading.value = true

  try {
    rows.value = await getRolesApi()
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
 * 删除管理权限
 */
async function deleteRole() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchDeleteRoleApi(selected.value.map(v => v.id))
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
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div
      v-if="isEdit"
      flex="~ gap4"
    >
      <ZBtn
        v-if="adminRole?.includes(PermissionType.ROLE_CREATE)"
        label="添加权限"
        @click="dialogType = 'add'"
      >
        <template #left>
          <div w5 h5 i-mingcute:add-line />
        </template>
      </ZBtn>
      <ZBtn
        v-if="adminRole?.includes(PermissionType.ROLE_DELETE)"
        label="删除权限"
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
        noDataLabel: '暂无管理权限记录',
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-first-column
      :fixed-last-column="adminRole?.includes(PermissionType.ROLE_DELETE)"
    >
      <template #body-cell-info="{ row }">
        <q-td auto-width>
          <TextBtn
            label="查看完整信息"
            @click="() => {
              dialogType = 'view'
              role = row
            }"
          />
        </q-td>
      </template>
      <template #body-cell-action="{ row }">
        <q-td auto-width>
          <ZBtn
            label="编辑"
            size="small"
            @click="() => {
              dialogType = 'edit'
              role = row
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 删除权限 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除权限"
      footer
      @ok="deleteRole"
    >
      该操作将删除已选的管理权限，是否继续？
    </ZDialog>

    <!-- 添加、编辑管理权限 -->
    <AdminRoleDialog
      v-model:type="dialogType"
      :role="role"
      @callback="queryRoleList"
    />
  </div>
</template>
