<script lang="ts" setup>
import moment from 'moment'
import { logDataActionDescriptions, PermissionType } from 'zjf-types'
import type { ILog } from 'zjf-types'
import type { QTableColumn, QTableProps } from 'quasar'
import ZTable from '~/components/table/ZTable.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可以编辑（下载） */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.LOG_MANAGE))
/** 加载中 */
const loading = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<ILog>[]>([
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
    name: 'ip',
    label: 'IP地址',
    field: 'ip',
  },
  {
    name: 'root',
    label: '类',
    field: row => row.target?.rootName,
  },
  {
    name: 'database',
    label: '数据库',
    field: row => row.target?.dbName,
  },
  {
    name: 'subDatabase',
    label: '子库',
    field: row => row.target?.subDbName,
  },
  {
    name: 'part',
    label: '模块',
    field: row => row.target?.moduleName,
  },
  {
    name: 'table',
    label: '表格',
    field: row => row.target?.tableName,
  },
  {
    name: 'time',
    label: '操作时间',
    field: row => moment(row.time).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    name: 'action',
    label: '操作类型',
    field: row => logDataActionDescriptions[row.action],
  },
])
/** 表格分页信息 */
const pagination = TABLE_PAGINATION()
/** 表格筛选字段 */
const text = ref('')
/** 日期筛选 */
const date = ref<{
  from: string
  to: string
}>()

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
})

/**
 * 查询日志记录列表
 */
const queryLogRecords: QTableProps['onRequest'] = async (props) => {
  const { filter } = props
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    let dsl = '${status} = 0'
    if (filter)
      dsl += ` AND \${user.account} LIKE '${filter}'`
    if (date.value?.from)
      dsl += ` AND \${time} >= '${date.value?.from}'`
    if (date.value?.to)
      dsl += ` AND \${time} <= '${date.value?.to}'`

    const { total, records } = await queryLogByDslApi({
      page,
      pageSize: rowsPerPage,
      dsl,
    })
    pagination.value.rowsNumber = total.value
    rows.value = records
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

/**
 * 禁用选择的时间范围
 */
function optionsFn (date: string) {
  return date <= moment().format('YYYY/MM/DD')
}

watch(
  date,
  () => {
    zTable.value?.tableRef?.requestServerInteraction()
  }
)
</script>

<template>
  <div full flex="~ col gap4">
    <div flex="~ gap4 wrap">
      <ZInput
        v-model="text"
        placeholder="搜索用户账号"
        :params="{
          debounce: 500
        }"
        size="medium"
        w70
      >
        <template #append>
          <div w5 h5 i-carbon:search />
        </template>
      </ZInput>
      <ZDate
        v-model="date"
        range w70 mr-auto
        :input-params="{
          size: 'medium'
        }"
        :date-params="{
          options: optionsFn
        }"
      />
      <ZBtn
        v-if="isEdit"
        label="导出为CSV"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
        @click="downloadTableData(cols, rows, '日志管理')"
      >
        <template #left>
          <div w5 h5 i-mingcute:download-line />
        </template>
      </ZBtn>
    </div>

    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      :rows="rows"
      :cols="cols"
      :loading="loading"
      :params="{
        noDataLabel: '暂无日志记录',
        filter: text,
      }"
      flex-1 h0
      @request="queryLogRecords"
    />
  </div>
</template>
