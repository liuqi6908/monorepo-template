<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import type { QTableColumn } from 'quasar'
import type { IDataDirectory } from 'zjf-types'

import DataRootDialog from './DataRoot.dialog.vue'
import type { Type } from './DataRoot.dialog.vue'

const { adminRole } = useUser()
const { loading, dataList, selectedId, queryDataList } = useDataRoot()
const { active, menu } = useMenu()

/** 是否可以编辑（添加、删除） */
const isEdit = computed(() => hasIntersection(
  adminRole.value ?? [],
  [
    PermissionType.DATA_ROOT_CREATE,
    PermissionType.DATA_ROOT_DELETE,
  ],
))

/** 数据资源弹窗类型 */
const dialogType = ref<Type>()
/** 弹窗数据资源 */
const dialogData = ref<IDataDirectory>()
/** 删除对话框 */
const deleteDialog = ref(false)

/** 表格列 */
const cols = reactive<QTableColumn[]>([
  ...cloneDeep(DATA_TABLE_COLUMNS),
  {
    name: 'structure',
    label: '结构',
    field: 'structure'
  },
  {
    name: 'upload',
    label: '上传情况',
    field: 'upload'
  },
  {
    name: 'introduce',
    label: '数据介绍',
    field: 'introduce'
  },
])
/** 多选 */
const selected = ref<IDataDirectory[]>()

watch(
  dialogType,
  (newVal) => {
    if (!newVal || newVal === 'add')
      dialogData.value = undefined
  },
)

onBeforeMount(() => {
  if (adminRole.value?.includes(PermissionType.DATA_ROOT_UPDATE)) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  cols.forEach(v => v.align = 'center')
  queryDataList()
})

/**
 * 删除数据资源
 */
async function deleteRoot() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchDeleteRootApi(selected.value.map(v => v.id))
    Notify.create({
      type: 'success',
      message: '操作成功'
    })
  }
  finally {
    selected.value = undefined
    if (res)
      queryDataList()
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
        v-if="adminRole?.includes(PermissionType.DATA_ROOT_CREATE)"
        label="新建"
        @click="dialogType = 'add'"
      >
        <template #left>
          <div w5 h5 i-mingcute:add-line />
        </template>
      </ZBtn>
      <ZBtn
        v-if="adminRole?.includes(PermissionType.DATA_ROOT_DELETE)"
        label="删除"
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
      :rows="dataList"
      :cols="cols"
      :params="{
        noDataLabel: '暂无数据资源记录',
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-first-column
      :fixed-last-column="adminRole?.includes(PermissionType.DATA_ROOT_UPDATE)"
    >
      <template #body-cell-structure="{ row }">
        <q-td text-center>
          <TextBtn
            label="查看结构"
            :disable="!adminRole?.includes(PermissionType.DATA_QUERY)"
            @click="() => {
              active = menu?.[1]?.id
              selectedId = row.id
            }"
          />
        </q-td>
      </template>
      <template #body-cell-upload="{ row }">
        <q-td text-center>
          <TextBtn
            label="查看上传情况"
            :disable="!adminRole?.includes(PermissionType.DATA_UPLOAD_QUERY)"
            @click="() => {
              active = menu?.[2]?.id
              selectedId = row.id
            }"
          />
        </q-td>
      </template>
      <template #body-cell-introduce="{ row }">
        <q-td text-center>
          <TextBtn
            label="查看数据介绍"
            :disable="
              !adminRole?.includes(PermissionType.DATA_INTRO_QUERY)
              || !row.children?.[0]
            "
            @click="() => {
              active = menu?.[3]?.id
              selectedId = row.children?.[0].id
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
              dialogData = row
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 删除 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除"
      footer
      @ok="deleteRoot"
    >
      该操作将删除已选的数据资源类型，是否继续？
    </ZDialog>

    <!-- 添加、编辑 -->
    <DataRootDialog
      v-model:type="dialogType"
      :data-root="dialogData"
      @callback="() => {
        selected = undefined
        queryDataList()
      }"
    />
  </div>
</template>
