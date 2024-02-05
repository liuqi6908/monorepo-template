<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType } from 'zjf-types'
import { hasIntersection, validatePassword } from 'zjf-utils'
import type { QTableProps } from 'quasar'
import type { IDesktop } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'
import UserDetails from '~/views/user/UserDetails.vue'
import DesktopDialog from './Desktop.dialog.vue'
import BatchAddDesktop from './BatchAddDesktop.vue'
import DesktopQuota from './DesktopQuota.vue'
import type { Type } from './Desktop.dialog.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可以编辑（创建、停用、开关机、配置） */
const isEdit = computed(() => (
  hasIntersection(
    adminRole.value ?? [],
    [
      PermissionType.DESKTOP_CREATE,
      PermissionType.DESKTOP_DISABLE,
      PermissionType.CONFIG_QUERY_DESKTOP,
    ],
  )
  || (getEnvVariable('VITE_DESKTOP_ON_OFF')
    && adminRole.value?.includes(PermissionType.DESKTOP_ON_OFF)
  )
))

/** 加载中 */
const loading = ref(false)
/** 云桌面弹窗类型 */
const dialogType = ref<Type>()
/** 弹窗云桌面 */
const dialogData = ref<IDesktop>()
/** 停用对话框 */
const stopDialog = ref(false)
/** 虚拟机操作类型 */
const vmType = ref<'开机' | '关机' | '重启'>()

/** 输入用户密码对话框 */
const passwordDialog = ref<string>()
/** 用户登录密码 */
const password = ref('')

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive(cloneDeep(DESKTOP_TABLE_COLUMNS))
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)
/** 多选 */
const selected = ref<IDesktop[]>()

onBeforeMount(() => {
  if (adminRole.value?.includes(PermissionType.DESKTOP_UPDATE)) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  const userCol = cols.findIndex(v => v.name === 'user')
  if (userCol >= 0)
    cols[userCol].label = '分配的用户'
  cols.forEach(v => v.align = 'center')
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
      filters: [
        {
          field: 'disabled',
          type: '=',
          value: false,
        }
      ],
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
 * 回调函数，重新获取云桌面列表
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 查看云桌面密码
 */
async function viewDesktopPassword(id?: string) {
  if (!password.value || !id)
    return passwordDialog.value = id

  loading.value = true
  try {
    const res = await queryDesktopPasswordApi(
      id,
      {
        password: rsaEncrypt(password.value),
      }
    )
    const row = rows.value?.find(v => v.id === id)
    if (row)
      row.password = res
  }
  catch (_) {
    password.value = ''
  }
  finally {
    loading.value = false
  }
}

/**
 * 停用云桌面
 */
async function stopDesktop() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchStopDesktopApi(selected.value.map(v => v.id))
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
 * 开机、关机、重启 云桌面
 */
async function operateVM() {
  const type = vmType.value
  const id = selected.value?.map(v => v.id)
  if (!type || !id?.length)
    return

  try {
    if (type === '开机')
      await batchStartVMApi(id)
    else if (type === '关机')
      await batchStopVMApi(id)
    else if (type === '重启')
      await batchRebootVMApi(id)
    Notify.create({
      type: 'success',
      message: '操作成功',
    })
  }
  finally {
    selected.value = undefined
  }
}
</script>

<template>
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div v-if="isEdit" flex="~ wrap" gap="x4 y2">
      <div flex="~ wrap" gap="x4 y2" mr-auto>
        <template v-if="adminRole?.includes(PermissionType.DESKTOP_CREATE)">
          <ZBtn
            label="添加云桌面"
            @click="dialogType = 'add'"
          >
            <template #left>
              <div w5 h5 i-mingcute:add-line />
            </template>
          </ZBtn>
          <BatchAddDesktop @callback="callback" @loading="(val: boolean) => loading = val" />
        </template>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.DESKTOP_DISABLE)"
          label="停用"
          text-color="primary-1"
          :disable="!selected?.length"
          :params="{
            outline: true,
          }"
          @click="stopDialog = true"
        >
          <template #left>
            <div w5 h5 i-mingcute:minus-circle-line />
          </template>
        </ZBtn>
      </div>
      <div flex="~ wrap" gap="x4 y2">
        <DesktopQuota
          v-if="adminRole?.includes(PermissionType.CONFIG_QUERY_DESKTOP)"
          @loading="(val: boolean) => loading = val"
        />
        <template v-if="getEnvVariable('VITE_DESKTOP_ON_OFF') && adminRole?.includes(PermissionType.DESKTOP_ON_OFF)">
          <ZBtn
            label="开机"
            text-color="primary-1"
            :disable="!selected?.length"
            :params="{
              outline: true,
            }"
            @click="vmType = '开机'"
          >
            <template #left>
              <div w5 h5 i-mingcute:power-line />
            </template>
          </ZBtn>
          <ZBtn
            label="重启"
            text-color="primary-1"
            :disable="!selected?.length"
            :params="{
              outline: true,
            }"
            @click="vmType = '重启'"
          >
            <template #left>
              <div w5 h5 i-mingcute:refresh-2-line />
            </template>
          </ZBtn>
          <ZBtn
            label="关机"
            text-color="primary-1"
            :disable="!selected?.length"
            :params="{
              outline: true,
            }"
            @click="vmType = '关机'"
          >
            <template #left>
              <div w5 h5 i-mingcute:power-line />
            </template>
          </ZBtn>
        </template>
      </div>
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
      :fixed-last-column="adminRole?.includes(PermissionType.DESKTOP_UPDATE)"
      @request="queryDesktopList"
    >
      <template #body-cell-password="{ row, value }">
        <q-td text-center>
          <TextBtn
            v-if="typeof value === 'undefined'"
            label="查看密码"
            @click="viewDesktopPassword(row.id)"
          />
          <div v-else-if="!value">—</div>
          <div v-else v-text="value" />
        </q-td>
      </template>
      <template #body-cell-user="{ row }">
        <q-td text-center>
          <div v-if="!row.user">—</div>
          <UserDetails
            v-else
            :user="row.user"
            :label="row.user.account"
          />
        </q-td>
      </template>
      <template #body-cell-action="{ row }">
        <q-td text-center>
          <ZBtn
            label="编辑"
            size="small"
            @click="() => {
              dialogType = 'edit'
              dialogData = row
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 停用 -->
    <ZDialog
      v-model="stopDialog"
      title="停用"
      footer
      @ok="stopDesktop"
    >
      该操作将停用已选的云桌面资源，是否继续？
    </ZDialog>

    <!-- 开机、关机、重启 云桌面 -->
    <ZDialog
      :model-value="!!vmType"
      :title="vmType ?? ''"
      footer
      @ok="operateVM"
      @update:model-value="vmType = undefined"
    >
      该操作将{{ vmType }}已选的云桌面资源，是否继续？
    </ZDialog>

    <!-- 输入用户登录密码 -->
    <ZDialog
      :model-value="!!passwordDialog"
      title="管理员密码"
      footer
      :disable-confirm="!!validatePassword(password)"
      @ok="viewDesktopPassword(passwordDialog)"
      @update:model-value="passwordDialog = undefined"
    >
      <ZInput
        v-model="password"
        label="密码"
        placeholder="请输入管理员密码"
        password required
        :params="{
          rules: [
            (val: string) => validatePassword(val) || true,
          ]
        }"
      />
    </ZDialog>

    <!-- 添加、编辑 -->
    <DesktopDialog
      v-model:type="dialogType"
      :desktop="dialogData"
      @callback="callback"
    />
  </div>
</template>
