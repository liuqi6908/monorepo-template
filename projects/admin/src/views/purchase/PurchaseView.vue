<script lang="ts" setup>
import moment from 'moment'
import { PermissionType } from 'zjf-types'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IDataDirectory, IDataSuggestion } from 'zjf-types'

const { adminRole } = useUser()

/** 是否可以编辑（下载） */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.DATA_SUGGEST_DOWNLOAD))
/** 加载中 */
const loading = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<IDataSuggestion>[]>([
  {
    name: 'account',
    label: '用户',
    field: row => row.user?.account,
  },
  {
    name: 'email',
    label: '邮箱',
    field: row => row.user?.email,
  },
  {
    name: 'name',
    label: '姓名',
    field: row => row.user?.verification?.name,
  },
  {
    name: 'root',
    label: '类',
    field: row => getDataByLevel(row.dataDirectory, 0)?.nameZH,
  },
  {
    name: 'database',
    label: '数据库',
    field: row => getDataByLevel(row.dataDirectory, 1)?.nameZH,
  },
  {
    name: 'subDatabase',
    label: '子库',
    field: row => getDataByLevel(row.dataDirectory, 2)?.nameZH,
  },
  {
    name: 'part',
    label: '模块',
    field: row => getDataByLevel(row.dataDirectory, 3)?.nameZH,
  },
  {
    name: 'table',
    label: '表格',
    field: row => getDataByLevel(row.dataDirectory, 4)?.nameZH,
  },
  {
    name: 'reason',
    label: '采购理由',
    field: 'reason',
  },
  {
    name: 'createdAt',
    label: '提交时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
])
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
})

/**
 * 获取指定层级的数据资源
 */
function getDataByLevel(data: IDataDirectory, level: number) {
  if (data.level === level)
    return data
  else if (data.parent)
    return getDataByLevel(data.parent, level)
}

/**
 * 查询申请采购记录列表
 */
const queryPurchaseRecords: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const { total, data } = await queryDataSuggestApi({
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      sort: [
        {
          field: sortBy as keyof IDataSuggestion,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
      relations: {
        user: {
          verification: true,
        },
        dataDirectory: {
          parent: {
            parent: {
              parent: {
                parent: true,
              }
            }
          }
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
</script>

<template>
  <div full flex="~ col gap4">
    <div v-if="isEdit" flex="~ justify-end">
      <ZBtn
        label="导出为CSV"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
        @click="downloadTableData(cols, rows, '采购管理')"
      >
        <template #left>
          <div w5 h5 i-mingcute:download-line />
        </template>
      </ZBtn>
    </div>

    <ZTable
      v-model:pagination="pagination"
      :rows="rows"
      :cols="cols"
      :loading="loading"
      :params="{
        noDataLabel: '暂无申请采购记录',
        binaryStateSort: true,
      }"
      flex-1 h0
      @request="queryPurchaseRecords"
    />
  </div>
</template>
