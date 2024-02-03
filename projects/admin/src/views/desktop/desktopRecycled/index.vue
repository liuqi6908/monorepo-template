<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType } from 'zjf-types'
import { validatePassword } from 'zjf-utils'
import type { QTableProps } from 'quasar'
import type { IDesktop } from 'zjf-types'

import ZTable from '~/components/table/ZTable.vue'
import UserDetails from '~/views/user/UserDetails.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可以编辑（删除） */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.DESKTOP_DELETE))

/** 加载中 */
const loading = ref(false)
/** 删除对话框 */
const deleteDialog = ref(false)

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
  const userCol = cols.findIndex(v => v.name === 'user')
  if (userCol >= 0)
    cols[userCol].label = '上一个使用的用户'
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
          value: true,
        }
      ],
      sort: [
        {
          field: sortBy as keyof IDesktop,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
      relations: {
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
        password: rsaEncrypt(import.meta.env.VITE_PUBLIC_KEY ?? '', password.value),
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
 * 删除云桌面
 */
async function deleteDesktop() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchDeleteDesktopApi(selected.value.map(v => v.id))
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
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div v-if="isEdit" flex="~ gap4">
      <ZBtn
        label="彻底删除"
        :disable="!selected?.length"
        @click="deleteDialog = true"
      >
        <template #left>
          <div w5 h5 i-mingcute:delete-2-line />
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
        noDataLabel: '暂无云桌面信息记录',
        binaryStateSort: true,
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-first-column
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
        <q-td auto-width text-center>
          <div v-if="!row.lastUser">—</div>
          <UserDetails
            v-else
            :user="row.lastUser"
            :label="row.lastUser.account"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 彻底删除 -->
    <ZDialog
      v-model="deleteDialog"
      title="彻底删除"
      footer
      @ok="deleteDesktop"
    >
      该操作将彻底删除已选的云桌面资源，是否继续？
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
  </div>
</template>
