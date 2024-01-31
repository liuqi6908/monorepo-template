<script lang="ts" setup>
import moment from 'moment'
import { Notify } from 'quasar'
import { PermissionType } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IUser } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'
import UserDetails from '../UserDetails.vue'
import AddUser from './AddUser.vue'
import BatchAddUser from './BatchAddUser.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 加载中 */
const loading = ref(false)
/** 修改账号状态对话框 */
const updateAccountStatusDialog = ref(false)
/** 账号状态 */
const accountStatus = ref(false)
/** 清空用户密码对话框 */
const deleteUserPasswordDialog = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<IUser>[]>([
  {
    name: 'account',
    label: '用户',
    field: 'account',
  },
  {
    name: 'email',
    label: '邮箱',
    field: 'email',
  },
  {
    name: 'name',
    label: '姓名',
    field: row => row.verification?.name,
  },
  {
    name: 'dataRole',
    label: '用户角色',
    field: row => row.dataRole?.name,
  },
  {
    name: 'role',
    label: '管理员角色',
    field: row => row.role?.name,
  },
  {
    name: 'createdAt',
    label: '注册时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'status',
    label: '认证状态',
    field: row => row.verification?.status,
  },
  {
    name: 'isDeleted',
    label: '账号状态',
    field: 'isDeleted',
    sortable: true,
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
const selected = ref<IUser[]>()

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
})

/**
 * 查询用户列表
 */
const queryUserList: QTableProps['onRequest'] = async (props) => {
  const { filter } = props
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const { total, data } = await queryUserListApi({
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: filter ? [
        {
          field: 'account',
          type: 'LIKE',
          value: filter,
        },
      ] : undefined,
      sort: [
        {
          field: sortBy as keyof IUser,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
      relations: {
        verification: true,
        dataRole: true,
        role: true,
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
    selected.value = undefined
  }
}

/**
 * 回调函数，重新获取用户列表
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 修改账号状态
 */
async function updateAccountStatus() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    if (accountStatus.value)
      res = await deleteUserApi(selected.value.map(v => v.id))
    else
      res = await recoverUserApi(selected.value.map(v => v.id))
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
 * 清空用户密码
 */
async function deleteUserPassword() {
  if (!selected.value?.length)
    return

  loading.value = true
  try {
    await batchDeleteUserPasswordApi(selected.value.map(v => v.id))
    Notify.create({
      type: 'success',
      message: '操作成功'
    })
  }
  finally {
    selected.value = undefined
    loading.value = false
  }
}
</script>

<template>
  <div full flex="~ col gap4">
    <div flex="~ gap4 wrap">
      <div flex="~ gap4 wrap" mr-auto>
        <template v-if="adminRole?.includes(PermissionType.ACCOUNT_CREATE)">
          <AddUser @callback="callback" />
          <BatchAddUser @callback="callback" />
        </template>
        <ZBtn
          v-if="hasIntersection(
            adminRole ?? [],
            [
              PermissionType.ACCOUNT_DELETE,
              PermissionType.ACCOUNT_UPDATE,
            ]
          )"
          label="修改账号状态"
          text-color="primary-1"
          :disable="!selected?.length"
          :params="{
            outline: true,
          }"
          @click="() => {
            updateAccountStatusDialog = true
            accountStatus = false
          }"
        >
          <template #left>
            <div w5 h5 i-mingcute:edit-2-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.ACCOUNT_DELETE_PASSWORD)"
          label="清空用户密码"
          text-color="primary-1"
          :params="{
            outline: true,
          }"
          :disable="!selected?.length"
          @click="deleteUserPasswordDialog = true"
        >
          <template #left>
            <div w5 h5 i-mingcute:delete-2-line />
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
        noDataLabel: '暂无用户信息记录',
        filter: text,
        binaryStateSort: true,
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-last-column
      @request="queryUserList"
    >
      <template #body-cell-status="{ value }">
        <q-td auto-width text-center>
          <VerifyStatus v-if="value" :status="value" />
          <div v-else v-text="'—'" />
        </q-td>
      </template>
      <template #body-cell-isDeleted="{ value }">
        <q-td auto-width text-center>
          <AccountStatus :disable="value" />
        </q-td>
      </template>
      <template #body-cell-action="{ row }">
        <q-td auto-width>
          <UserDetails :user="row" />
        </q-td>
      </template>
    </ZTable>

    <!-- 修改账号状态 -->
    <ZDialog
      v-model="updateAccountStatusDialog"
      title="修改账号状态"
      footer
      @ok="updateAccountStatus"
    >
      <div flex="~ gap10">
        <ZRadio
          :model-value="accountStatus.toString()"
          val="false"
          label="正常"
          @update:model-value="accountStatus = false"
        />
        <ZRadio
          :model-value="accountStatus.toString()"
          val="true"
          label="禁用"
          @update:model-value="accountStatus = true"
        />
      </div>
    </ZDialog>

    <!-- 清空用户密码 -->
    <ZDialog
      v-model="deleteUserPasswordDialog"
      title="清空用户密码"
      footer
      @ok="deleteUserPassword"
    >
      该操作将清空已选用户账号的密码，是否继续？
    </ZDialog>
  </div>
</template>
