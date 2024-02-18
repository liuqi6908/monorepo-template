<script lang="ts" setup>
import { Notify } from 'quasar'
import { FileExportLargeStatus, fileExportLargeStatusDescriptions } from 'zjf-types'
import { browser, formatFileSize } from 'zjf-utils'
import type { IFileExportSmall, IFileExportLarge, IFileExportBasic, IQueryDto } from 'zjf-types'
import type { QTableColumn } from 'quasar'
import moment from 'moment'

type ExportFile = IFileExportSmall & IFileExportLarge

/** 当前页面 */
const value = ref(EXPORT_MENU[0].value)
/** 加载中 */
const loading = ref(false)

/** 大文件外发状态列表 */
const statusList = Object.values(FileExportLargeStatus)
  .map(v => ({
    label: fileExportLargeStatusDescriptions[v],
    value: v,
  }))
/** 筛选记录 */
const select = ref(statusList)
/** 筛选字段 */
const text = ref('')

/** 查询数据请求体 */
const queryBody: IQueryDto<IFileExportBasic> = {
  sort: [
    {
      field: 'createdAt',
      order: 'DESC',
    },
  ],
  relations: {
    founder: {
      verification: true
    }
  }
}

/** 表格列字段 */
const tableCols = reactive<QTableColumn<ExportFile>[]>([
  {
    name: 'fileName',
    label: '文件名',
    field: 'fileName',
  },
  {
    name: 'email',
    label: '邮箱地址',
    field: 'email',
  },
  {
    name: 'note',
    label: '备注信息',
    field: 'note',
  },
  {
    name: 'fileSize',
    label: '文件大小',
    field: row => formatFileSize(row.fileSize),
  },
  {
    name: 'name',
    label: '真实姓名',
    field: row => row.founder?.verification?.name,
  },
  {
    name: 'status',
    label: '状态',
    field: 'status',
  },
  {
    name: 'rejectReason',
    label: '驳回理由',
    field: 'rejectReason',
  },
  {
    name: 'createdAt',
    label: '外发时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    name: 'action',
    label: '附件',
    field: 'id',
  },
])
/** 表格行信息 */
const tableRows = ref<(ExportFile)[]>()

/** 驳回原因 */
const rejectReason = ref<string>()
/** 下载对话框 */
const downloadDialog = ref<IFileExportLarge>()

onBeforeMount(() => {
  tableCols.forEach(v => v.align = 'center')
})

watch(
  value,
  async (newVal) => {
    if (!newVal)
      return

    loading.value = true
    tableRows.value = []
    try {
      let res: any
      if (newVal === 'small')
        res = await queryOwnExportSmApi(queryBody)
      else if (newVal === 'big')
        res = await queryOwnExportLgApi(queryBody)
      tableRows.value = res?.data
    }
    finally {
      loading.value = false
    }
  },
  {
    immediate: true,
  },
)

/** 过滤表格行 */
const filterTableRows = computed(() => {
  return (tableRows.value as (IFileExportSmall & IFileExportLarge)[])?.filter((row) => (
    value.value === 'small'
    || !select.value?.length
    || select.value.map(v => v.value).includes(row.status)
  ))
    .filter((row) => (
      !text.value
      || row.fileName.toLowerCase().includes(text.value.toLowerCase())
    ))
})

/**
 * 下载
 */
async function handleDownload() {
  if (!downloadDialog.value)
    return
  loading.value = true
  try {
    const item = downloadDialog.value
    let res: Blob
    if (value.value === 'small')
      res = await downloadOwnExportSmFileApi(item.id)
    else
      res = await downloadOwnExportLgFileApi(item.id)
    browser.downloadBlob(res, item.fileName)
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
  <div relative flex="~ col gap8">
    <ZLoading :value="loading" />
    <ZBtnToggle v-model="value" :options="EXPORT_MENU" self-center />
    <div flex="~ col gap4">
      <div flex="~ items-center justify-between wrap gap4">
        <div text-base font-600>
          外发记录
        </div>
        <div flex="~ gap-x-10 gap-y-4 wrap">
          <ZChipSelect
            v-if="value === 'big'"
            v-model="select"
            :options="statusList"
            min-w-65 size="medium"
          />
          <ZInput
            v-model="text"
            placeholder="搜索文件名"
            w60 size="medium"
          >
            <template #prepend>
              <div w5 h5 text-grey-5 i-material-symbols:search />
            </template>
          </ZInput>
        </div>
      </div>

      <ZTable
        :cols="tableCols.filter(v => value === 'big' || !['status', 'rejectReason'].includes(v.name))"
        :rows="filterTableRows"
        :params="{
          noDataLabel: '暂无数据'
        }"
      >
        <template #body-cell-note="{ value }">
          <td>
            <div
              text-center max-w="50vw" min-w-60
              line-clamp-6 whitespace="pre-wrap!"
              v-text="value || '无'"
            />
          </td>
        </template>
        <template #body-cell-status="{ value }">
          <td>
            <ExportStatus :status="value" />
          </td>
        </template>
        <template #body-cell-rejectReason="{ value }">
          <td text-center>
            <div
              v-if="value"
              text-primary-1 cursor-pointer
              @click="rejectReason = value"
            >
              点击查看
            </div>
            <div v-else>—</div>
          </td>
        </template>
        <template #body-cell-action="{ row }">
          <q-td text-center>
            <ZBtn
              label="下载"
              size="small"
              :disable="value === 'big' && row.status !== FileExportLargeStatus.APPROVED"
              @click="downloadDialog = row"
            />
          </q-td>
        </template>
      </ZTable>
    </div>

    <!-- 驳回对话框 -->
    <ZDialog
      :model-value="!!rejectReason"
      title="驳回理由"
      @update:model-value="rejectReason = undefined"
    >
      <div
        class="hide-scrollbar" break-all
        min-h-20 style="max-height: calc(100vh - 200px)"
        v-text="rejectReason || '暂无驳回理由'"
      />
    </ZDialog>

    <!-- 下载对话框 -->
    <ZDialog
      :model-value="!!downloadDialog"
      title="下载确认"
      footer
      @ok="handleDownload"
      @update:model-value="downloadDialog = undefined"
    >
      该操作将下载{{ value === 'small' ? '小' : '大' }}文件外发附件，是否继续？
    </ZDialog>
  </div>
</template>
