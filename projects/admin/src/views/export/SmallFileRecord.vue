<script lang="ts" setup>
import { PermissionType } from 'zjf-types'
import { browser } from 'zjf-utils'
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IFileExportSmall } from 'zjf-types'
import ZTable from '~/components/table/ZTable.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可以编辑（下载） */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.EXPORT_SM_DOWNLOAD))
/** 加载中 */
const loading = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = computed<QTableProps['columns']>(() => {
  const cols = cloneDeep(EXPORT_TABLE_COLUMNS)
  if (isEdit.value) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  return cols.map(v => ({
    ...v,
    align: 'center',
  }))
})
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)

/** 下载对话框 */
const downloadDialog = ref<IFileExportSmall>()

/**
 * 查询小文件自动外发记录
 */
const queryExportSmRecords: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const { total, data } = await queryAllExportSmApi({
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      sort: [
        {
          field: sortBy as keyof IFileExportSmall,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
      relations: {
        founder: {
          verification: true,
        },
      },
    })
    pagination.value.rowsNumber = total
    rows.value = data
  }
  catch (_) {
    rows.value = []
  }
  finally {
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
    loading.value = false
  }
}

/**
 * 下载
 */
async function handleDownload() {
  if (!downloadDialog.value)
    return
  loading.value = true
  try {
    const item = downloadDialog.value
    const res = await downloadExportSmFileApi(item.id)
    browser.downloadBlob(res, item.fileName)
    Notify.create({
      type: 'success',
      message: '下载成功',
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div full>
    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      :rows="rows"
      :cols="cols"
      :loading="loading"
      :params="{
        noDataLabel: '暂无小文件自动外发记录',
        binaryStateSort: true,
      }"
      :fixed-last-column="isEdit"
      @request="queryExportSmRecords"
    >
      <template #body-cell-action="{ row }">
        <q-td auto-width>
          <ZBtn
            label="下载"
            size="small"
            @click="downloadDialog = row"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 下载对话框 -->
    <ZDialog
      :model-value="!!downloadDialog"
      title="下载确认"
      footer
      @ok="handleDownload"
      @update:model-value="downloadDialog = undefined"
    >
      该操作将下载小文件外发附件，是否继续？
    </ZDialog>
  </div>
</template>
