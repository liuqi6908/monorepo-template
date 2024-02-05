<script lang="ts" setup>
import moment from 'moment'
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType, DesktopQueueStatus } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import type { QTableProps } from 'quasar'
import type { IDesktopQueue, IQueryDto } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'
import UserDetails from '../../user/UserDetails.vue'
import AttachmentsDialog from '../Attachments.dialog.vue'
import AddRequest from './AddRequest.vue'
import ManualAssignDialog from './ManualAssign.dialog.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可以编辑（创建待分配申请、自动分配、手动分配） */
const isEdit = computed(() => (
  hasIntersection(
    adminRole.value ?? [],
    [
      PermissionType.DESKTOP_REQUEST_CREATE,
      PermissionType.DESKTOP_ASSIGN,
    ],
  )
  || (getEnvVariable('VITE_DESKTOP_AUTO_ALLOT')
    && adminRole.value?.includes(PermissionType.DESKTOP_CREATE_ASSIGN)
  )
))

/** 加载中 */
const loading = ref(false)
/** 自动分配对话框 */
const autoDialog = ref(false)
/** 手动分配对话框 */
const manualDialog = ref(false)
/** 查看申请材料的用户id */
const userId = ref<IDesktopQueue['userId']>()
/** 申请材料 */
const attachments = ref<IDesktopQueue['attachments']>()

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive(cloneDeep(DESKTOP_REQUEST_TABLE_COLUMNS))
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('requestAt', true)
/** 单选 */
const selected = ref<IDesktopQueue>()

onBeforeMount(() => {
  if (!adminRole.value?.includes(PermissionType.DESKTOP_REQUEST_CAT_ATTACHMENT))
    cols.splice(5, 1)
  cols.splice(4, 0, {
    name: 'queueAt',
    label: '排队时间',
    field: row => moment(row.queueAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },)
  cols.forEach(v => v.align = 'center')
})

/**
 * 查询待分配云桌面申请列表
 */
const queryDesktopRequestList: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IDesktopQueue> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'status',
          type: '=',
          value: DesktopQueueStatus.QUEUEING,
        },
      ],
      sort: [
        {
          field: sortBy as keyof IDesktopQueue,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
      relations: {
        user: {
          dataRole: true,
          role: true,
          verification: true,
        }
      },
    }

    const { total, data } = await queryDesktopRequestApi(body)
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
 * 回调函数，重新获取待审核云桌面申请列表
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 自动分配
 */
async function autoAssign() {
  if (!selected.value)
    return

  loading.value = true
  try {
    // const res = await autoAssignApi(selected.value.id)
    Notify.create({
      type: 'success',
      message: '操作成功',
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div v-if="isEdit" flex="~ gap4">
      <AddRequest v-if="adminRole?.includes(PermissionType.DESKTOP_REQUEST_CREATE)" @callback="callback" />
      <ZBtn
        v-if="getEnvVariable('VITE_DESKTOP_AUTO_ALLOT') && adminRole?.includes(PermissionType.DESKTOP_CREATE_ASSIGN)"
        label="自动分配"
        :disable="!selected"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
        @click="autoDialog = true"
      >
        <template #left>
          <div w5 h5 i-mingcute:flash-line />
        </template>
      </ZBtn>
      <ZBtn
        v-if="adminRole?.includes(PermissionType.DESKTOP_ASSIGN)"
        label="手动分配"
        :disable="!selected"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
        @click="manualDialog = true"
      >
        <template #left>
          <div w5 h5 i-mingcute:hand-finger-line />
        </template>
      </ZBtn>
    </div>

    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      :rows="rows"
      :cols="cols"
      :params="{
        noDataLabel: '暂无待分配云桌面申请记录',
        binaryStateSort: true,
        selection: 'multiple',
        rowKey: 'userId',
      }"
      flex-1 h0
      fixed-first-column
      @request="queryDesktopRequestList"
    >
      <template #header-selection>
        选择
      </template>
      <template #body-selection="{ row }">
        <ZRadio
          :model-value="selected?.userId"
          :val="row.userId"
          @update:model-value="selected = row"
        />
      </template>
      <template #body-cell-attachments="{ row, value }">
        <q-td text-center>
          <TextBtn
            label="查看申请材料"
            :disable="!value?.length"
            @click="() => {
              userId = row.userId
              attachments = value
            }"
          />
        </q-td>
      </template>
      <template #body-cell-userId="{ row }">
        <q-td text-center>
          <UserDetails
            :user="row.user"
            label="查看用户信息"
          />
        </q-td>
      </template>
      <template #body-cell-status="{ value }">
        <q-td text-center>
          <DesktopRequestStatus :status="value" />
        </q-td>
      </template>
    </ZTable>

    <!-- 自动分配 -->
    <ZDialog
      v-model="autoDialog"
      title="自动分配"
      footer
      @ok="autoAssign"
    >
      该操作将为已选的用户申请自动创建云桌面并分配，是否继续？
    </ZDialog>

    <AttachmentsDialog
      :user-id="userId"
      :attachments="attachments"
      @close-dialog="() => {
        userId = undefined
        attachments = undefined
      }"
    />

    <ManualAssignDialog
      v-model="manualDialog"
      :id="selected?.userId"
      @callback="callback"
    />
  </div>
</template>
