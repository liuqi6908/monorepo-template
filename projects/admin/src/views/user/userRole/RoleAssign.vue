<script lang="ts" setup>
import moment from 'moment'
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType } from 'zjf-types'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IUser, IDataRole } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'
import UserDetails from '../UserDetails.vue'
import UserRoleDialog from './dialog/UserRole.vue'
import type { Type } from './dialog/UserRole.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 加载中 */
const loading = ref(false)
/** 用户角色弹窗类型 */
const dialogType = ref<Type>()
/** 用户角色弹窗id */
const dialogId = ref<string>()
/** 分配角色对话框 */
const assignDialog = ref(false)
/** 设置默认角色对话框 */
const defaultDialog = ref(false)

/** 用户角色列表 */
const roleList = ref<IDataRole[]>()
/** 默认角色 */
const defaultRole = computed(() => roleList.value?.find(v => v.id === 'visitor'))
/** 当前选中的角色 */
const selectRole = ref<IDataRole>()

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<IUser>[]>([
  ...cloneDeep(USER_TABLE_COLUMNS),
  {
    name: 'createdAt',
    label: '注册时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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

onBeforeMount(async () => {
  cols.forEach(v => v.align = 'center')
  roleList.value = await getDataRoleListApi()
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
 * 分配用户数据角色
 */
async function assignDataRole(id?: string) {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchUpdateUserDataRoleApi({
      dataRoleId: id,
      id: selected.value.map(v => v.id),
    })
    Notify.create({
      type: 'success',
      message: '操作成功'
    })
  }
  finally {
    selected.value = undefined
    if (res)
      zTable.value?.tableRef?.requestServerInteraction()
    else
      loading.value = false
  }
}
</script>

<template>
  <div flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div flex="~ wrap" gap="x4 y2">
      <div flex="~ wrap" gap="x4 y2" mr-auto>
        <template v-if="adminRole?.includes(PermissionType.ACCOUNT_UPDATE_DATA_ROLE)">
          <ZBtn
            label="分配角色"
            :disable="!selected?.length"
            @click="assignDialog = true"
          >
            <template #left>
              <div w5 h5 i-mingcute:add-line />
            </template>
          </ZBtn>
          <ZBtn
            :label="'设为默认' + (defaultRole ? `（${defaultRole.name}）` : '')"
            text-color="primary-1"
            :params="{
              outline: true,
            }"
            :disable="!selected?.length"
            @click="defaultDialog = true"
          >
            <template #left>
              <div w5 h5 i-mingcute:refresh-3-line />
            </template>
          </ZBtn>
        </template>
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
      <template #body-cell-dataRole="{ value }">
        <q-td auto-width max-w="none!" class="data-role-cell">
          <div v-if="!value" text-center v-text="'—'" />
          <div v-else px20 text-center>
            {{ value }}
            <div
              class="show-details"
              text-grey-5 flex="~ items-center gap2"
              absolute-y-center right-4
              cursor-pointer hover:text-primary-1
              invisible select-none
              @click="() => {
                dialogType = 'view'
                dialogId = roleList?.find(v => v.name === value)?.id
              }"
            >
              <div w4 h4 i-mingcute:fullscreen-2-line />
              详情
            </div>
          </div>
        </q-td>
      </template>
      <template #body-cell-action="{ row }">
        <q-td auto-width>
          <UserDetails :user="row" />
        </q-td>
      </template>
    </ZTable>

    <UserRoleDialog v-model:type="dialogType" :id="dialogId" />

    <!-- 分配角色 -->
    <ZDialog
      v-model="assignDialog"
      title="分配角色"
      footer
      :disable-confirm="!selectRole"
      @ok="assignDataRole(selectRole?.id)"
    >
      <ZSelect
        v-model="selectRole"
        :options="roleList"
        label="角色"
        placeholder="请选择角色"
        required
        :params="{
          optionLabel: 'name',
        }"
      />
    </ZDialog>

    <!-- 设为默认角色 -->
    <ZDialog
      v-model="defaultDialog"
      :title="'设为默认' + (defaultRole ? `（${defaultRole.name}）` : '')"
      footer
      @ok="assignDataRole()"
    >
      该操作将为已选用户设置默认{{ defaultRole ? `（${defaultRole.name}）` : '' }}角色，是否继续？
    </ZDialog>
  </div>
</template>

<style lang="scss" scoped>
.data-role-cell:hover {
  .show-details {
    visibility: visible;
  }
}
</style>
