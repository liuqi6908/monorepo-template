<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { PermissionType } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import type { QTableProps } from 'quasar'
import type { IDesktop } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'
import UserDetails from '~/views/user/UserDetails.vue'
import DesktopDialog from './Desktop.dialog.vue'
import BatchAddDesktop from './BatchAddDesktop.vue'
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
          <BatchAddDesktop @callback="callback" />
        </template>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.DESKTOP_DISABLE)"
          label="停用"
          text-color="primary-1"
          :disable="!selected?.length"
          :params="{
            outline: true,
          }"
          @click=""
        >
          <template #left>
            <div w5 h5 i-mingcute:delete-2-line />
          </template>
        </ZBtn>
      </div>
      <div
        h10 flex="~ items-center" px4
        rounded-2 bg-grey-2 text-sm
      >
        云桌面限额：50 台
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
      <template #body-cell-user="{ row }">
        <q-td auto-width text-center>
          <div v-if="!row.user">—</div>
          <UserDetails
            v-else
            :user="row.user"
            :label="row.user.account"
          />
        </q-td>
      </template>
      <template #body-cell-action="{ row }">
        <q-td auto-width>
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

    <!-- 添加、编辑 -->
    <DesktopDialog
      v-model:type="dialogType"
      :desktop="dialogData"
      @callback="callback"
    />
  </div>
</template>
