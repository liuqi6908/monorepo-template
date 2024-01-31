<script lang="ts" setup>
import moment from 'moment'
import { Notify } from 'quasar'
import { PermissionType, VerificationStatus } from 'zjf-types'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IVerificationHistory, IQueryDto } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'
import UserDetails from '../UserDetails.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 加载中 */
const loading = ref(false)
/** 认证通过对话框 */
const approveDialog = ref(false)
/** 认证驳回对话框 */
const rejectDialog = ref(false)
/** 驳回理由 */
const rejectReason = ref('')
/** 重置认证对话框 */
const resetDialog = ref(false)

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
/** 多选 */
const selected = ref<IVerificationHistory[]>()

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
    selected.value = undefined
  }
}

/**
 * 回调函数，重新获取认证列表
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 认证通过
 */
async function approve() {
  const id = selected.value?.filter(v => v.status === VerificationStatus.PENDING).map(v => v.id)
  if (!id?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchApproveVerificationApi(id)
    Notify.create({
      type: 'success',
      message: '操作成功'
    })
  }
  finally {
    selected.value = undefined
    if (res)
      callback()
    else
      loading.value = false
  }
}

/**
 * 认证驳回
 */
async function reject() {
  const id = selected.value?.filter(v => v.status === VerificationStatus.PENDING).map(v => v.id)
  if (!id?.length || !!validateRejectReason(rejectReason.value))
    return

  loading.value = true
  let res
  try {
    res = await batchRejectVerificationApi({
      id,
      reason: rejectReason.value,
    })
    Notify.create({
      type: 'success',
      message: '操作成功'
    })
  }
  finally {
    selected.value = undefined
    if (res)
      callback()
    else
      loading.value = false
  }
}

/**
 * 重置认证
 */
async function reset() {
  const id = selected.value?.filter(v => v.status === VerificationStatus.APPROVED).map(v => v.id)
  if (!id?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchCancelVerificationApi(id)
    Notify.create({
      type: 'success',
      message: '操作成功'
    })
  }
  finally {
    selected.value = undefined
    if (res)
      callback()
    else
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
          :disable="!selected?.filter(v => v.status === VerificationStatus.PENDING).length"
          @click="approveDialog = true"
        >
          <template #left>
            <div w5 h5 i-mingcute:check-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.VERIFICATION_REJECT)"
          label="认证驳回"
          :disable="!selected?.filter(v => v.status === VerificationStatus.PENDING).length"
          @click="() => {
            rejectDialog = true
            rejectReason = ''
          }"
        >
          <template #left>
            <div w5 h5 i-mingcute:close-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.VERIFICATION_CANCEL)"
          label="重置认证"
          :disable="!selected?.filter(v => v.status === VerificationStatus.APPROVED).length"
          @click="resetDialog = true"
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
      ref="zTable"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :rows="rows"
      :cols="cols"
      :loading="loading"
      :params="{
        noDataLabel: '暂无用户认证记录',
        filter: text,
        binaryStateSort: true,
        selection: 'multiple',
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
        <q-td auto-width>
          <UserDetails :verify="row" />
        </q-td>
      </template>
    </ZTable>

    <!-- 认证通过 -->
    <ZDialog
      v-model="approveDialog"
      title="认证通过"
      footer
      @ok="approve"
    >
      该操作将通过已选用户的认证申请，是否继续？
    </ZDialog>

    <!-- 认证驳回 -->
    <ZDialog
      v-model="rejectDialog"
      title="认证驳回"
      footer
      :disable-confirm="!!validateRejectReason(rejectReason)"
      @ok="reject"
    >
      <ZInput
        v-model="rejectReason"
        label="驳回理由"
        placeholder="请输入驳回理由"
        required
        type="textarea"
        :params="{
          rules: [
            (val: string) => validateRejectReason(val) || true
          ],
        }"
      />
    </ZDialog>

    <!-- 重置认证 -->
    <ZDialog
      v-model="resetDialog"
      title="重置认证"
      footer
      @ok="reset"
    >
      该操作将重置已选用户的认证申请，是否继续？
    </ZDialog>
  </div>
</template>
