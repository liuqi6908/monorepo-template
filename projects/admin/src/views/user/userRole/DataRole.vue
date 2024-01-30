<script lang="ts" setup>
import { PermissionType } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IDataRole } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

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
/** 添加角色对话框 */
const addDialog = ref(false)
/** 编辑角色对话框 */
const updateDialog = ref(false)
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
  try {}
  finally {
    selected.value = undefined
    loading.value = false
  }
}
</script>

<template>
  <div flex="~ col gap4">
    <div
      v-if="isEdit"
      flex="~ gap4"
    >
      <ZBtn
        v-if="adminRole?.includes(PermissionType.DATA_PERMISSION_CREATE)"
        label="添加角色"
        @click="addDialog = true"
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
        @click="updateDialog = true"
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
      ref="zTable"
      v-model:selected="selected"
      :rows="rows"
      :cols="cols"
      :loading="loading"
      :params="{
        noDataLabel: '暂无用户角色记录',
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-last-column
    />

    <!-- 删除角色 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除角色"
      footer
      @ok="deleteRole"
    >
      该操作将删除已选的用户角色，是否继续？
    </ZDialog>
  </div>
</template>
