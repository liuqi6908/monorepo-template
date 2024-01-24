<script lang="ts" setup>
import { FileExportLargeStatus, PermissionType } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import { cloneDeep } from 'lodash'
import type { QTableProps } from 'quasar'

const { adminRole } = useUser()

/** 是否可以编辑 */
const isEdit = computed(() => hasIntersection(
  adminRole.value ?? [],
  [
    PermissionType.EXPORT_LG_DOWNLOAD,
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
  const cols = cloneDeep(exportTableColumns)
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
const pagination = tablePagination()

/**
 * 查询大文件外发待审核记录
 */
const queryPendingRecords: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination
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
          field: 'createdAt',
          order: 'DESC',
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
    loading.value = false
  }
}
</script>

<template>
  <ZTable
    v-model:pagination="pagination"
    :rows="rows"
    :cols="cols"
    :loading="loading"
    :params="{
      noDataLabel: '暂无待审核外发记录',
    }"
    @request="queryPendingRecords"
  />
</template>
