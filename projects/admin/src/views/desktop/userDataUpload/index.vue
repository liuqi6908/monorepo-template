<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType, MinioBucket } from 'zjf-types'
import { formatFileSize, fileSizeToBytes, hasIntersection, FILE_SIZE_UNITS } from 'zjf-utils'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IDesktop } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'
import UserDetails from '~/views/user/UserDetails.vue'
import FtpQuota from './FtpQuota.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可以编辑（清空、配置） */
const isEdit = computed(() => hasIntersection(
  adminRole.value ?? [],
  [
    PermissionType.CONFIG_QUERY_DESKTOP_FTP,
    PermissionType.CONFIG_UPSERT_DESKTOP_FTP,
    PermissionType.DESKTOP_FTP_DELETE,
  ],
))

/** 加载中 */
const loading = ref(false)
/** 修改配额对话框 */
const quotaDialog = ref(false)
/** 配额 */
const quota = ref<number>()
/** 单位 */
const unit = ref<string>()
/** 清空数据对话框 */
const clearDialog = ref(false)

/** 禁用提交 */
const disable = computed(() => !quota.value || quota.value <= 0 || quota.value >= 1024 || !unit.value)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<IDesktop>[]>([
  ...cloneDeep(DESKTOP_TABLE_COLUMNS),
  {
    name: 'status',
    label: '状态',
    field: 'disabled',
  },
  {
    name: 'usedQuota',
    label: '已用配额',
    field: row => {
      const value = usedQuota.value[row.id]
      return value ? formatFileSize(value) : undefined
    },
  },
  {
    name: 'quota',
    label: '可上传配额',
    field: row => row.ftpQuota ? formatFileSize(row.ftpQuota) : undefined,
  },
])
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)
/** 多选 */
const selected = ref<IDesktop[]>()

/** 云桌面已用配额 */
const usedQuota = ref<Record<IDesktop['id'], number>>({})

onBeforeMount(() => {
  cols.splice(5, 1)
  cols.forEach(v => v.align = 'center')
  getUsedQuota()
})

/**
 * 查询云桌面列表
 */
const queryDesktopList: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const { total, data } = await queryDesktopApi({
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      sort: [
        {
          field: sortBy as keyof IDesktop,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
      relations: {
        user: {
          dataRole: true,
          role: true,
          verification: true,
        },
        lastUser: {
          dataRole: true,
          role: true,
          verification: true,
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
    selected.value = undefined
  }
}

/**
 * 获取云桌面已用配额
 */
async function getUsedQuota() {
  loading.value = true
  usedQuota.value = {}
  try {
    const res = await getFolderFilesApi({
      bucket: MinioBucket.FTP,
      path: ''
    })
    console.log(res)
  }
  finally {
    loading.value = false
  }
}

/**
 * 回调函数，重新获取云桌面列表
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 修改云桌面的配额
 */
async function updateDesktopQuota() {
  if (disable.value || !selected.value?.length)
    return

  loading.value = true
  let res
  try {
    const value = Math.floor(fileSizeToBytes(`${quota.value} ${unit.value}`))

    res = await batchUpdateDesktopFtpQuotaApi({
      id: selected.value.map(v => v.id),
      ftpQuota: value,
    })
    Notify.create({
      type: 'success',
      message: '修改成功',
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
 * 清空云桌面数据
 */
async function clearDesktopData() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    /* res = await batchStopDesktopApi(selected.value.map(v => v.id))
    Notify.create({
      type: 'success',
      message: '操作成功'
    }) */
  }
  finally {
    selected.value = undefined
    loading.value = false
  }
}
</script>

<template>
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div v-if="isEdit" flex="~ gap4">
      <div flex="~ gap4" mr-auto>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.CONFIG_UPSERT_DESKTOP_FTP)"
          label="修改配额"
          :disable="!selected?.length"
          @click="() => {
            quotaDialog = true
            quota = 0
            unit = FILE_SIZE_UNITS[0]
          }"
        >
          <template #left>
            <div w5 h5 i-mingcute:edit-2-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.DESKTOP_FTP_DELETE)"
          label="清空数据"
          :disable="!selected?.length"
          @click="clearDialog = true"
        >
          <template #left>
            <div w5 h5 i-mingcute:delete-2-line />
          </template>
        </ZBtn>
      </div>
      <FtpQuota
        v-if="adminRole?.includes(PermissionType.CONFIG_QUERY_DESKTOP_FTP)"
        @loading="(val: boolean) => loading = val"
      />
    </div>

    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :rows="rows"
      :cols="cols"
      :params="{
        noDataLabel: '暂无云桌面信息记录',
        binaryStateSort: true,
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-first-column
      @request="queryDesktopList"
    >
      <template #body-cell-user="{ row }">
        <q-td auto-width text-center>
          <div v-if="!row.user && !row.lastUser">—</div>
          <UserDetails
            v-else
            :user="row.user ?? row.lastUser"
            :label="row.user?.account ?? row.lastUser?.account"
          />
        </q-td>
      </template>
      <template #body-cell-status="{ row, value }">
        <q-td auto-width>
          <DesktopStatus
            :status="value ? 'stopped' : row.user ? 'assigned' : 'waiting'"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 修改配额 -->
    <ZDialog
      v-model="quotaDialog"
      title="修改配额"
      :disable-confirm="disable"
      footer
      confirm-text="保存"
      @ok="updateDesktopQuota"
    >
      <div flex="~ gap10">
        <ZInput
          v-model.number="quota"
          label="云桌面配额"
          type="number"
          required flex-1
        />
        <ZSelect
          v-model="unit"
          label="单位"
          :options="FILE_SIZE_UNITS.filter((_, i) => i < 4)"
          w26
        />
      </div>
    </ZDialog>

    <!-- 清空数据 -->
    <ZDialog
      v-model="clearDialog"
      title="清空数据"
      footer
      @ok="clearDesktopData"
    >
      该操作将清空已选云桌面的数据资源，是否继续？
    </ZDialog>
  </div>
</template>
