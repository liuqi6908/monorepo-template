<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType, DesktopQueueStatus } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import type { QTableProps } from 'quasar'
import type { IDesktopQueue, IQueryDto } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'
import UserDetails from '../../user/UserDetails.vue'
import AttachmentsDialog from '../Attachments.dialog.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可以编辑（通过、驳回） */
const isEdit = computed(() => hasIntersection(
  adminRole.value ?? [],
  [
    PermissionType.DESKTOP_REQUEST_APPROVE,
    PermissionType.DESKTOP_REQUEST_REJECT,
  ],
))

/** 加载中 */
const loading = ref(false)
/** 申请通过对话框 */
const approveDialog = ref(false)
/** 申请驳回对话框 */
const rejectDialog = ref(false)
/** 驳回理由 */
const rejectReason = ref('')
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
/** 多选 */
const selected = ref<IDesktopQueue[]>()

onBeforeMount(() => {
  if (!adminRole.value?.includes(PermissionType.DESKTOP_REQUEST_CAT_ATTACHMENT))
    cols.splice(5, 1)
  cols.forEach(v => v.align = 'center')
})

/**
 * 查询待审核云桌面申请列表
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
          value: DesktopQueueStatus.PENDING,
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
 * 认证通过
 */
async function approve() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchApproveDesktopRequestApi(selected.value.map(v => v.userId))
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
  if (!selected.value?.length || !!validateRejectReason(rejectReason.value))
    return

  loading.value = true
  let res
  try {
    res = await batchRejectDesktopRequestApi({
      id: selected.value.map(v => v.userId),
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
</script>

<template>
  <div flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div v-if="isEdit" flex="~ gap4">
      <ZBtn
        v-if="adminRole?.includes(PermissionType.DESKTOP_REQUEST_APPROVE)"
        label="通过"
        :disable="!selected?.length"
        @click="approveDialog = true"
      >
        <template #left>
          <div w5 h5 i-mingcute:check-line />
        </template>
      </ZBtn>
      <ZBtn
        v-if="adminRole?.includes(PermissionType.DESKTOP_REQUEST_REJECT)"
        label="驳回"
        :disable="!selected?.length"
        @click="() => {
          rejectDialog = true
          rejectReason = ''
        }"
      >
        <template #left>
          <div w5 h5 i-mingcute:close-line />
        </template>
      </ZBtn>
    </div>

    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :rows="rows"
      :cols="cols"
      :params="{
        noDataLabel: '暂无待审核云桌面申请记录',
        binaryStateSort: true,
        selection: 'multiple',
        rowKey: 'userId',
      }"
      flex-1 h0
      fixed-first-column
      @request="queryDesktopRequestList"
    >
      <template #body-cell-attachments="{ row, value }">
        <q-td auto-width>
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
        <q-td auto-width>
          <UserDetails
            :user="row.user"
            label="查看用户信息"
          />
        </q-td>
      </template>
      <template #body-cell-status="{ value }">
        <q-td auto-width>
          <DesktopRequestStatus :status="value" />
        </q-td>
      </template>
    </ZTable>

    <!-- 通过 -->
    <ZDialog
      v-model="approveDialog"
      title="通过"
      footer
      @ok="approve"
    >
      该操作将通过已选的云桌面申请，是否继续？
    </ZDialog>

    <!-- 驳回 -->
    <ZDialog
      v-model="rejectDialog"
      title="驳回"
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

    <AttachmentsDialog
      :user-id="userId"
      :attachments="attachments"
      @close-dialog="() => {
        userId = undefined
        attachments = undefined
      }"
    />
  </div>
</template>
