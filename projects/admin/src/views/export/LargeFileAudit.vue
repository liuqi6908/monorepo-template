<script lang="ts" setup>
import { FileExportLargeStatus, PermissionType } from 'zjf-types'
import { browser, hasIntersection } from 'zjf-utils'
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IFileExportLarge } from 'zjf-types'
import ZTable from '~/components/table/ZTable.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可以编辑（下载、通过、驳回） */
const isEdit = computed(() => hasIntersection(
  adminRole.value ?? [],
  [
    PermissionType.EXPORT_LG_APPROVE,
    PermissionType.EXPORT_LG_REJECT,
  ],
))
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
const downloadDialog = ref<IFileExportLarge>()
/** 通过对话框 */
const approveDialog = ref<IFileExportLarge>()
/** 驳回对话框 */
const rejectDialog = ref<IFileExportLarge>()
/** 驳回原因 */
const rejectReason = ref<string>()

/**
 * 查询大文件外发待审核记录
 */
const queryPendingRecords: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const { total, data } = await queryAllExportLgApi({
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'status',
          type: '=',
          value: FileExportLargeStatus.PENDING,
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
 * 通过
 */
async function handleApprove() {
  if (!approveDialog.value)
    return
  loading.value = true
  try {
    await approveExportLgApi(approveDialog.value.id)
    Notify.create({
      type: 'success',
      message: '通过成功',
    })
    zTable.value?.tableRef?.requestServerInteraction()
  }
  finally {
    loading.value = false
  }
}

/**
 * 驳回
 */
async function handleReject() {
  if (!rejectDialog.value || !rejectReason.value)
    return
  loading.value = true
  try {
    await rejectExportLgApi(rejectDialog.value.id, {
      reason: rejectReason.value,
    })
    Notify.create({
      type: 'success',
      message: '驳回成功',
    })
    zTable.value?.tableRef?.requestServerInteraction()
  }
  finally {
    loading.value = false
    rejectReason.value = undefined
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
        noDataLabel: '暂无大文件外发待审核记录',
        binaryStateSort: true,
      }"
      :fixed-last-column="isEdit"
      @request="queryPendingRecords"
    >
      <template #body-cell-action="{ row }">
        <q-td auto-width>
          <div flex="~ gap2">
            <ZBtn
              v-if="adminRole?.includes(PermissionType.EXPORT_LG_DOWNLOAD)"
              label="下载"
              size="small"
              @click="downloadDialog = row"
            />
            <ZBtn
              v-if="adminRole?.includes(PermissionType.EXPORT_LG_APPROVE)"
              label="通过"
              size="small"
              color="alerts-success"
              @click="approveDialog = row"
            />
            <ZBtn
              v-if="adminRole?.includes(PermissionType.EXPORT_LG_REJECT)"
              label="驳回"
              size="small"
              color="alerts-error"
              @click="() => {
                rejectDialog = row
                rejectReason = ''
              }"
            />
          </div>
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

    <!-- 通过对话框 -->
    <ZDialog
      :model-value="!!approveDialog"
      title="通过确认"
      footer
      @ok="handleApprove"
      @update:model-value="approveDialog = undefined"
    >
      该操作将通过大文件外发审核，是否继续？
    </ZDialog>

    <!-- 驳回对话框 -->
    <ZDialog
      :model-value="!!rejectDialog"
      title="驳回确认"
      footer
      :disable-confirm="!rejectReason"
      @ok="handleReject"
      @update:model-value="rejectDialog = undefined"
    >
      <ZInput
        v-model="rejectReason"
        label="驳回理由"
        placeholder="请输入驳回理由"
      />
    </ZDialog>
  </div>
</template>
