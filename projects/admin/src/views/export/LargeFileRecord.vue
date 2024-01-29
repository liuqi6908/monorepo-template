<script lang="ts" setup>
import moment from 'moment'
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { browser } from 'zjf-utils'
import { FileExportLargeStatus, fileExportLargeStatusDescriptions, PermissionType } from 'zjf-types'
import type { QTableProps, QTableColumn } from 'quasar'
import type { IFileExportLarge } from 'zjf-types'
import ZTable from '~/components/table/ZTable.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可以编辑（下载） */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.EXPORT_LG_DOWNLOAD))
/** 加载中 */
const loading = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = computed<QTableProps['columns']>(() => {
  const cols: QTableColumn<IFileExportLarge>[] = [
    ...cloneDeep(EXPORT_TABLE_COLUMNS),
    {
      name: 'status',
      label: '状态',
      field: 'status',
      sortable: true,
    },
    {
      name: 'rejectReason',
      label: '驳回原因',
      field: 'rejectReason',
    },
    {
      name: 'handleAt',
      label: '审核时间',
      field: row => row.handleAt ? moment(row.handleAt).format('YYYY-MM-DD HH:mm:ss') : '',
      sortable: true,
    },
    {
      name: 'handlerAccount',
      label: '审核人账号',
      field: row => row.handler?.account,
    },
    {
      name: 'handlerName',
      label: '审核人姓名',
      field: row => row.handler?.verification?.name,
    },
  ]
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
const downloadDialog = ref<IFileExportLarge>()

/** 外发状态标签筛选 */
const statusTag = ref(
  (Object.keys(fileExportLargeStatusDescriptions) as FileExportLargeStatus[]).map(v => ({
    status: v,
    flag: true
  }))
)

/**
 * 查询大文件外发审核记录
 */
const queryExportLgRecords: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const tags = statusTag.value.filter(v => v.flag).map(v => v.status)
    if (!tags.length)
      throw new Error('请至少选择一个状态')

    const { total, data } = await queryAllExportLgApi({
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'status',
          type: 'IN',
          value: tags,
        },
      ],
      sort: [
        {
          field: sortBy as keyof IFileExportLarge,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
      relations: {
        founder: {
          verification: true,
        },
        handler: {
          verification: true,
        }
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
    const res = await downloadExportLgFileApi(item.id)
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

/**
 * 切换筛选标签状态
 */
function changeTagStatus(item: typeof statusTag.value[number]) {
  item.flag =!item.flag
  zTable.value?.tableRef?.requestServerInteraction()
}
</script>

<template>
  <div full flex="~ col gap4">
    <div flex="~ items-center justify-end gap2">
      <div text="sm grey-5" font-500>
        筛选标签：
      </div>
      <div flex="~ gap4">
        <ExportStatus
          v-for="item in statusTag"
          :key="item.status"
          :status="item.status"
          :disable="!item.flag"
          text-sm cursor-pointer
          @click="changeTagStatus(item)"
        />
      </div>
    </div>
    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      :rows="rows"
      :cols="cols"
      :loading="loading"
      :params="{
        noDataLabel: '暂无大文件外发审核记录',
        binaryStateSort: true,
      }"
      :fixed-last-column="isEdit"
      flex-1 h0
      @request="queryExportLgRecords"
    >
      <template #body-cell-status="{ value }">
        <q-td auto-width>
          <ExportStatus :status="value" text-sm />
        </q-td>
      </template>
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
      该操作将下载大文件外发附件，是否继续？
    </ZDialog>
  </div>
</template>
