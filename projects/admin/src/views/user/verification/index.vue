<script lang="ts" setup>
import moment from 'moment'
import { PermissionType, VerificationStatus } from 'zjf-types'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IVerificationHistory, IQueryDto } from 'zjf-types'

import UserDetails from '../UserDetails.vue'

const { adminRole } = useUser()

/** 加载中 */
const loading = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<IVerificationHistory>[]>([
  {
    name: 'account',
    label: '用户',
    field: row => row.founder?.account,
  },
  {
    name: 'email',
    label: '邮箱',
    field: row => row.founder?.email,
  },
  {
    name: 'name',
    label: '姓名',
    field: 'name',
  },
  {
    name: 'dataRole',
    label: '用户角色',
    field: row => row.founder?.dataRole?.name,
  },
  {
    name: 'role',
    label: '管理员角色',
    field: row => row.founder?.role?.name,
  },
  {
    name: 'createdAt',
    label: '提交认证时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'status',
    label: '认证状态',
    field: 'status',
  },
  {
    name: 'action',
    label: '完整信息',
    field: 'id',
  },
])
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)
/** 表格筛选字段 */
const text = ref('')

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
})

/**
 * 查询认证列表
 */
const queryVerifyList: QTableProps['onRequest'] = async (props) => {
  const { filter } = props
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IVerificationHistory> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'status',
          type: 'IN',
          value: [
            VerificationStatus.APPROVED,
            VerificationStatus.PENDING,
          ],
        },
      ],
      sort: [
        {
          field: sortBy as keyof IVerificationHistory,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
      relations: {
        founder: {
          dataRole: true,
          role: true,
        }
      },
    }
    if (filter) {
      body.filters?.push({
        field: 'founder.account',
        type: 'LIKE',
        value: filter,
      })
    }
    const { total, data } = await queryAllVerificationsApi(body)
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
    <div flex="~ gap4 wrap">
      <div flex="~ gap4 wrap" mr-auto>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.VERIFICATION_APPROVE)"
          label="认证通过"
        >
          <template #left>
            <div w5 h5 i-mingcute:check-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.VERIFICATION_REJECT)"
          label="认证驳回"
        >
          <template #left>
            <div w5 h5 i-mingcute:close-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.VERIFICATION_CANCEL)"
          label="重置认证"
        >
          <template #left>
            <div w5 h5 i-mingcute:refresh-3-line />
          </template>
        </ZBtn>
      </div>
      <ZInput
        v-model="text"
        class="rounded"
        placeholder="搜索用户账号"
        :params="{
          debounce: 500,
        }"
        size="medium"
        w80
      >
        <template #prepend>
          <div w5 h5 i-mingcute:search-line />
        </template>
      </ZInput>
    </div>

    <ZTable
      v-model:pagination="pagination"
      :rows="rows"
      :cols="cols"
      :loading="loading"
      :params="{
        noDataLabel: '暂无用户认证记录',
        filter: text,
        binaryStateSort: true,
      }"
      flex-1 h0
      fixed-last-column
      @request="queryVerifyList"
    >
      <template #body-cell-status="{ value }">
        <q-td auto-width text-center>
          <VerifyStatus :status="value" />
        </q-td>
      </template>
      <template #body-cell-action="{ row }">
        <q-td>
          <UserDetails :verify="row" />
        </q-td>
      </template>
    </ZTable>
  </div>
</template>
