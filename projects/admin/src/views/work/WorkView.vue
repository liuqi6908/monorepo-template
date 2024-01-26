<script lang="ts" setup>
import moment from 'moment'
import { Notify } from 'quasar'
import { browser } from 'zjf-utils'
import { PermissionType } from 'zjf-types'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IWork } from 'zjf-types'

const { adminRole } = useUser()

/** 是否可以编辑（下载） */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.WORK_DOWNLOAD))
/** 加载中 */
const loading = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = computed<QTableProps['columns']>(() => {
  const cols: QTableColumn<IWork>[] = [
    {
      name: 'account',
      label: '用户',
      field: row => row.user?.account,
    },
    {
      name: 'email',
      label: '邮箱',
      field: row => row.user?.email,
    },
    {
      name: 'name',
      label: '姓名',
      field: row => row.user?.verification?.name,
    },
    {
      name: 'title',
      label: '标题',
      field: 'title',
    },
    {
      name: 'author',
      label: '作者',
      field: 'author',
    },
    {
      name: 'filename',
      label: '文件名',
      field: 'filename',
    },
    {
      name: 'createdAt',
      label: '上传时间',
      field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      name: 'updatedAt',
      label: '修改时间',
      field: (row) => {
        if (row.createdAt !== row.updatedAt)
          return moment(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      },
    },
  ]
  if (isEdit.value) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  return cols.map(v => ({
    ...v,
    align: 'center',
  }))
})
/** 表格分页信息 */
const pagination = TABLE_PAGINATION()

/** 下载对话框 */
const downloadDialog = ref<IWork>()

/**
 * 查询作品记录列表
 */
const queryWorksRecords: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const { total, data } = await queryAllWorksApi({
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      sort: [
        {
          field: 'createdAt',
          order: 'DESC',
        },
      ],
      relations: {
        user: {
          verification: true,
        },
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
    loading.value = false
  }
}

/**
 * 下载
 */
async function handleDownload() {
  if (!downloadDialog.value)
    return
  loading.value = true
  try {
    const item = downloadDialog.value
    const res = await downloadWorkFileApi(item.id)
    browser.downloadBlob(res, item.filename)
    Notify.create({
      type: 'success',
      message: '下载成功',
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div full>
    <ZTable
      v-model:pagination="pagination"
      :rows="rows"
      :cols="cols"
      :loading="loading"
      :params="{
        noDataLabel: '暂无作品记录',
      }"
      @request="queryWorksRecords"
    >
      <template #body-cell-action="{ row }">
        <q-td auto-width>
          <ZBtn
            label="下载"
            size="small"
            @click="downloadDialog = row"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 下载对话框 -->
    <ZDialog
      :model-value="!!downloadDialog"
      title="下载确认"
      footer
      @ok="handleDownload"
      @update:model-value="downloadDialog = undefined"
    >
      该操作将下载作品附件，是否继续？
    </ZDialog>
  </div>
</template>
