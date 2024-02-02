<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { pick } from 'zjf-utils'
import { PermissionType } from 'zjf-types'
import type { QTableColumn, QTableProps } from 'quasar'

const { loading, dataList, queryDataList } = useDataRoot()
const { adminRole } = useUser()

/** 表格列 */
const cols = reactive<QTableColumn[]>([
  ...cloneDeep(DATA_TABLE_COLUMNS),
  {
    name: 'database',
    label: '数据库',
    field: 'database'
  },
  {
    name: 'status',
    label: '上传状态',
    field: 'status'
  },
])
/** 表格行 */
const rows = computed<QTableProps['rows']>(() => {
  const arr: Record<string, string>[] = []
  dataList.value?.forEach((root) => {
    root.children?.forEach((database) => {
      arr.push({
        ...pick(root, 'id', 'nameZH', 'nameEN'),
        database: database.nameZH,
      })
    })
  })
  return arr
})

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
  queryDataList()
})
</script>

<template>
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div flex="~ wrap" gap="x4 y2">
      <div flex="~ gap4" mr-auto>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.DATA_UPLOAD_INTRO)"
          label="上传数据库介绍"
        >
          <template #left>
            <div w5 h5 i-mingcute:upload-3-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.DATA_EDIT_REFERENCE)"
          label="编辑引用规范"
          text-color="primary-1"
          :params="{
            outline: true,
          }"
        >
          <template #left>
            <div w5 h5 i-mingcute:edit-2-line />
          </template>
        </ZBtn>
      </div>
      <ZBtn
        label="数据库介绍预览"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
      >
        <template #left>
          <div w5 h5 i-mingcute:document-line />
        </template>
      </ZBtn>
    </div>

    <ZTable
      :rows="rows"
      :cols="cols"
      :params="{
        noDataLabel: '暂无数据资源记录',
      }"
      flex-1 h0
    >
      <!-- <template #body-cell-status="{ row }">
        <q-td auto-width max-w="none!">
          <UploadStatus v-bind="uploadCount[row.id]" />
        </q-td>
      </template> -->
    </ZTable>
  </div>
</template>
