<script lang="ts" setup>
import { MinioBucket } from 'zjf-types'
import { COMPRESSED_FILE_SUFFIX, formatFileSize, numberArrSum } from 'zjf-utils'
import moment from 'moment'
import { Notify } from 'quasar'
import type { QTableColumn } from 'quasar'
import type { FileItem } from 'shared/types/file.interface'

const { isDesktop } = useUser()
const { desktopFtp, getDesktopFtpConfig } = useSysConfig()
const { desktopInfo } = useDesktop()
const { basePath, uploadFile, deleteFile, downloadFile } = useMinio()

/** 加载中 */
const loading = ref(false)
/** 用户上传文件列表 */
const fileList = ref<FileItem[]>()
/** 筛选字段 */
const text = ref('')
/** 多选 */
const selected = ref<FileItem[]>()
/** 用户上传文件 */
const file = ref<File>()
/** 删除对话框 */
const deleteDialog = ref(false)

/** 文件传输配额 */
const ftpQuota = computed(() => desktopInfo.value?.ftpQuota ?? desktopFtp.value?.ftpQuota ?? 0)
/** 可用内存配额 */
const usableQuota = computed(() => {
  let quota = ftpQuota.value
  quota -= numberArrSum(fileList.value?.map(v => v.size) ?? [])
  return quota > 0 ? quota : 0
})

/** 表格列字段 */
const tableCols = reactive<QTableColumn[]>([
  {
    name: 'index',
    label: '序号',
    field: 'index',
    align: 'center',
  },
  {
    name: 'name',
    label: '文件名称',
    field: (row: FileItem) => row.name.split('/').pop(),
  },
  {
    name: 'lastModified',
    label: '上传时间',
    field: (row: FileItem) => moment(row.lastModified).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    name: 'size',
    label: '大小',
    field: (row: FileItem) => formatFileSize(row.size),
  },
  {
    name: 'operate',
    field: 'operate',
    label: '操作',
    align: 'center',
  },
])
/** 表格行信息 */
const tableRows = computed(() => {
  return fileList.value?.filter((row) => (
    !text.value
    || row.name.split('/').pop()?.toLowerCase().includes(text.value.toLowerCase())
  )).sort((a, b) => {
    return b.lastModified.localeCompare(a.lastModified)
  }).map((v, i) => ({
    ...v,
    index: i + 1,
  }))
})

onBeforeMount(() => {
  tableCols.forEach((v) => {
    if (!v.align)
      v.align = 'left'
  })
  getDesktopFtpConfig()
  getFileList()
})

watch(
  file,
  async (newVal) => {
    if (!newVal)
      return
    if (newVal.size > usableQuota.value) {
      return Notify.create({
        type: 'danger',
        message: '文件大小超出可用存储空间'
      })
    }
    const notify = Notify.create({
      type: 'loading',
      message: '正在上传中，请耐心等待...',
      caption: '上传进度：0%'
    })
    try {
      await uploadFile(newVal, notify)
      await getFileList()
      notify({
        type: 'success',
        message: '上传成功',
        caption: undefined
      })
    }
    catch (_) {
      notify({
        type: 'danger',
        message: '上传失败',
        caption: undefined
      })
    }
    file.value = undefined
  }
)

/**
 * 获取用户上传文件列表
 */
async function getFileList() {
  loading.value = true
  try {
    fileList.value = await getFolderFilesApi({
      bucket: MinioBucket.FTP,
      path: basePath.value,
    })
    selected.value = undefined
  }
  finally {
    loading.value = false
  }
}

/**
 * 删除已选文件
 */
function deleteSelectedFile() {
  if (!selected.value?.length)
    return

  loadingNotify(async () => {
    await deleteFile(selected.value!.map(v => v.name))
    await getFileList()
  }, '正在删除中...', '删除成功', '删除失败')
}
</script>

<template>
  <div flex="~ col gap4">
    <div font-600>
      数据上传至云桌面
    </div>
    <div
      v-if="!isDesktop"
      p="y2 x4" bg="alerts-error/8"
      text="sm center alerts-error" font-400
    >
      注意：上传成功后请在云桌面中登录本平台进行数据下载！（仅限上传 zip、rar、7z 等压缩格式文件）
    </div>
    <div flex="~ col gap4" p4 bg-grey-2 relative>
      <ZLoading :value="loading" />
      <div flex="~ items-center justify-between gap-x-5 gap-y-4 wrap">
        <div flex="~ gap2" text="sm grey-5" font-500>
          <div v-text="`配额：${formatFileSize(ftpQuota)}`" />
          <div>/</div>
          <div v-text="`可用：${formatFileSize(usableQuota)}`" />
        </div>
        <div flex="~ gap-x-5 gap-y-4 wrap">
          <ZInput
            v-model="text"
            placeholder="搜索文件名"
            w70 size="small"
          >
            <template #prepend>
              <div w5 h5 text-grey-5 i-material-symbols:search />
            </template>
          </ZInput>
          <div flex="~ gap5">
            <ZBtn
              label="删除"
              size="small"
              text-color="alerts-error"
              :disable="!selected?.length"
              :params="{
                outline: true
              }"
              @click="deleteDialog = true"
            >
              <template #icon>
                <div i-material-symbols:delete-outline />
              </template>
            </ZBtn>
            <ZBtn
              label="刷新"
              size="small" w22
              text-color="primary-1"
              :params="{
                outline: true
              }"
              @click="getFileList"
            >
              <template #icon>
                <div i-material-symbols:refresh />
              </template>
            </ZBtn>
            <ZUpload
              v-if="!isDesktop"
              v-model="file"
              :disable="!usableQuota"
              :accept="COMPRESSED_FILE_SUFFIX.map(v => `.${v}`).join(',')"
              :hintMessage="{
                accept: '仅允许上传压缩文件'
              }"
            >
              <ZBtn
                label="上传"
                size="small" w22
                text-color="primary-1"
                :disable="!usableQuota"
                :params="{
                  outline: true
                }"
              >
                <template #icon>
                  <div i-material-symbols:upload />
                </template>
              </ZBtn>
            </ZUpload>
          </div>
        </div>
      </div>
      <Empty
        v-if="!fileList?.length"
        py="4!" bg-grey-1
        label="您还未上传数据"
        :captions="!isDesktop ? '点击上方上传文件按钮，可以上传数据' : ''"
      />
      <ZTable
        v-else
        v-model:selected="selected"
        :cols="tableCols.filter((_, i) => isDesktop || i < tableCols.length - 1)"
        :rows="tableRows"
        :params="{
          rowKey: 'etag',
          selection: 'multiple',
          noDataLabel: '暂无数据',
          tableHeaderStyle: {
            backgroundColor: 'var(--grey-1)'
          }
        }"
      >
        <template #header-cell-index>
          <q-th auto-width>序号</q-th>
        </template>
        <template #body-cell-operate="props">
          <q-td auto-width>
            <ZBtn
              label="下载"
              size="small" w22
              text-color="primary-1"
              :params="{
                outline: true
              }"
              @click="downloadFile(props.row.name)"
            />
          </q-td>
        </template>
      </ZTable>
    </div>

    <!-- 删除已选文件对话框 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除提示"
      footer
      @ok="deleteSelectedFile"
    >
      确认后将删除已选文件，此操作不可恢复，是否继续？
    </ZDialog>
  </div>
</template>

<style lang="scss" scoped>
.z-input {
  :deep(.q-field) {
    .q-field__control::before {
        border-color: var(--grey-4) !important;
    }

    &:hover {
      .q-field__control::before {
        border-color: var(--grey-5) !important;
      }
    }
  }
}

.z-table {
  :deep() {
    .q-table__middle {
      thead th {
        color: var(--grey-8) !important;
        font-weight: 600;
        text-align: left;

        &.text-center {
          text-align: center;
        }
      }

      tr {
        th, td {
          &:first-child {
            padding: 0 10px;
          }
        }
      }
    }

    .q-table__bottom {
      background-color: var(--grey-1);
    }
  }
}
</style>