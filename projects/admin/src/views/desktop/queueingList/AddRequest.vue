<script lang="ts" setup>
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import { DESKTOP_REQUEST_DURATION_OPTION } from 'zjf-types'
import type { IUser, IQueryDto } from 'zjf-types'
import type { QTableColumn, QTableProps } from 'quasar'

import UserDetails from '../../user/UserDetails.vue'

const emits = defineEmits(['callback'])

const { desktopRequest, getDesktopRequestConfig } = useSysConfig()

/** 对话框 */
const dialog = ref(false)
/** 加载中 */
const loading = ref(false)

/** 选中的用户 */
const user = ref<IUser>()
/** 申请时长 */
const duration = ref<typeof DESKTOP_REQUEST_DURATION_OPTION[0]>()

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<IUser>[]>([
  ...cloneDeep(USER_TABLE_COLUMNS),
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
    name: 'action',
    label: '完整信息',
    field: 'id',
  },
])
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)
/** 表格筛选字段 */
const text = ref('')

/** 禁用提交 */
const disable = computed(() => !user.value || !duration.value)

watch(
  dialog,
  (newVal) => {
    if (newVal) {
      user.value = undefined
      duration.value = desktopRequest.value?.duration?.[0]
      text.value = ''
      pagination.value.sortBy = 'createdAt'
      pagination.value.descending = true
    }
  }
)

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
  getDesktopRequestConfig()
})

/**
 * 查询用户列表
 */
const queryUserList: QTableProps['onRequest'] = async (props) => {
  const { filter } = props
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IUser> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'verificationId',
          type: 'IS NOT NULL',
        },
        {
          field: 'isDeleted',
          type: '=',
          value: false,
        },
      ],
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
        desktopQueue: true,
      },
    }
    if (filter) {
      body.filters?.push({
        field: 'account',
        type: 'LIKE',
        value: filter,
      })
    }
    const { total, data } = await queryUserListApi(body)
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
    user.value = undefined
  }
}

/**
 * 创建待分配申请
 */
async function createRequest() {
  if (disable.value)
    return

  const res = await createUserDesktopRequestApi({
    userId: user.value!.id,
    duration: duration.value!.value,
  })
  if (res) {
    Notify.create({
      type: 'success',
      message: '添加成功',
    })
    emits('callback')
  }
}
</script>

<template>
  <div>
    <ZBtn
      label="添加待分配申请"
      @click="dialog = true"
    >
      <template #left>
        <div w5 h5 i-mingcute:add-line />
      </template>
    </ZBtn>

    <ZDialog
      v-model="dialog"
      class="add-desktop-request-dialog"
      title="添加待分配申请"
      footer
      confirm-text="保存"
      :disable-confirm="disable"
      :loading="loading"
      :params="{
        fullWidth: true,
        fullHeight: true,
      }"
      @ok="createRequest"
    >
      <div full flex="~ col gap4">
        <div flex="~ justify-between gap4">
          <ZSelect
            v-model="duration"
            class="rounded"
            :options="desktopRequest?.duration"
            label="申请时长"
            label-position="left"
            :label-width="70"
            placeholder="请选择申请时长"
            size="medium"
            required w65
          />
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
          :params="{
            noDataLabel: '暂无用户信息记录',
            filter: text,
            binaryStateSort: true,
            selection: 'multiple',
          }"
          flex-1 h0
          fixed-first-column
          fixed-last-column
          @request="queryUserList"
        >
          <template #header-selection>
            选择
          </template>
          <template #body-selection="{ row }">
            <ZRadio
              :model-value="user?.id"
              :val="row.id"
              :disable="!!row.desktopQueue"
              @update:model-value="user = row"
            />
          </template>
          <template #body-cell-action="{ row }">
            <q-td auto-width>
              <UserDetails :user="row" />
            </q-td>
          </template>
        </ZTable>
      </div>
    </ZDialog>
  </div>
</template>

<style lang="scss">
.add-desktop-request-dialog {
  .q-dialog__inner {
    > .q-card {
      > div {
        flex: 1;
        height: 0;
      }
    }
  }
}
</style>
