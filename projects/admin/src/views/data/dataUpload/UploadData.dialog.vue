<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType, UploadType } from 'zjf-types'
import {
  CSV_FILE_TYPE,
  ZIP_FILE_TYPE,
  isCsv,
  isZip,
  pick,
} from 'zjf-utils'
import type { QTableColumn } from 'quasar'
import type { IDataDirectory } from 'zjf-types'

interface TableRow {
  database?: string
  bDatabase?: string
  part?: string
  table?: string
  tableEn?: string
  preview?: number
  download?: number
}

const props = defineProps<{
  id?: IDataDirectory['id']
}>()
defineEmits(['update:id'])

const { adminRole } = useUser()
const { loading, dataList, previewResource, downloadResource, uploadTableData } = useDataRoot()

/** 是否可以编辑（上传数据） */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.DATA_UPLOAD_TABLE) && !!props.id)

/** 上传中，禁用按钮 */
const disable = ref(false)

/** 表格列 */
const cols = reactive<QTableColumn[]>([
  {
    name: 'database',
    label: '数据库（level-1）',
    field: 'database'
  },
  {
    name: 'bDatabase',
    label: '子库（level-2）',
    field: 'bDatabase'
  },
  {
    name: 'part',
    label: '模块（level-3）',
    field: 'part'
  },
  {
    name: 'table',
    label: '表（level-4）',
    field: 'table'
  },
  {
    name: 'tableEn',
    label: '表英文',
    field: 'tableEn'
  },
  {
    name: 'status',
    label: '上传状态',
    field: 'status'
  },
  {
    name: 'preview',
    label: '上传“样例数据”',
    field: 'preview'
  },
  {
    name: 'download',
    label: '上传“下载数据”',
    field: 'download'
  },
])
/** 表格行 */
const rows = computed<TableRow[]>(() => {
  const { id } = props
  const data = dataList.value?.find(v => v.id === props.id)?.children

  function processingData(
    data?: IDataDirectory[],
    nodes: TableRow[] = [],
    parent: TableRow = {}
  ): {
    nodes: TableRow[]
    parent: TableRow
  } {
    data?.forEach((v) => {
      let node = cloneDeep(parent)
      const { level, nameZH, nameEN } = v
      if (level === 1) {
        node = pick(node, 'database')
        node.database = nameZH
      }
      else if (level === 2) {
        node = pick(node, 'database', 'bDatabase')
        node.bDatabase = nameZH
      }
      else if (level === 3) {
        node = pick(node, 'database', 'bDatabase', 'part')
        node.part = nameZH
      }
      else if (level === 4) {
        node.table = nameZH
        node.tableEn = nameEN
        node.preview = previewResource.value?.[id!]?.includes(nameEN) ? 1 : 0
        node.download = downloadResource.value?.[id!]?.includes(nameEN) ? 1 : 0
        nodes.push(node)
      }

      if (v.level !== 4 && v.children?.length)
        processingData(v.children, nodes, node)
    })
    return { nodes, parent }
  }

  return processingData(data).nodes.filter((item) => {
    const { preview, download } = item
    return !filter.value.length
      || (filter.value.find(v => v.value === 'preview') && !preview)
      || (filter.value.find(v => v.value === 'download') && !download)
  })
})

/** 筛选可选项 */
const filterOptions = [
  { label: '未上传“样例数据”', value: 'preview' },
  { label: '未上传“下载数据”', value: 'download' }
]
/** 筛选 */
const filter = ref<(typeof filterOptions[number])[]>([])

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
})

/**
 * 上传表格 预览/下载 数据文件
 */
async function uploadTableDataFile(type: UploadType, file?: File, name?: string) {
  const { id } = props
  if (!file || !name || !id)
    return

  const fileType = type === UploadType.PREVIEW ? 'csv' : 'zip'
  if (
    (fileType === 'csv' && !isCsv(file))
    || (fileType === 'zip' &&!isZip(file))
  ) {
    Notify.create({
      type: 'danger',
      message: `只能上传 ${fileType.toLocaleUpperCase()} 文件`,
    })
    return
  }

  try {
    loading.value = true
    await uploadTableData({
      dataRootId: id,
      uploadType: type,
      filename: `${name}.${fileType}`
    }, file)
    Notify.create({
      type: 'success',
      message: '上传成功',
    })
    handlerUpload(type, name)
  }
  finally {
    loading.value = false
  }
}

/**
 * 批量上传表格 预览/下载 数据文件
 */
async function batchUploadTableDataFile(type: UploadType, files?: File[]) {
  const { id } = props
  if (!files?.length || !id)
    return

  const total = files.length
  let success = 0
  const error: Record<string, string> = {}

  const fileType = type === UploadType.PREVIEW ? 'csv' : 'zip'

  const notify = Notify.create({
    type: 'loading',
    message: '正在上传中，请耐心等待...',
    caption: `上传进度：0 / ${total}`
  })

  for (let i = 0; i < total; i++) {
    const file = files[i]
    const { name } = file
    if (
      (fileType === 'csv' && !isCsv(file))
      || (fileType === 'zip' &&!isZip(file))
    ) {
      error[name] = '文件类型不允许'
      continue
    }

    try {
      await uploadTableData(
        {
          dataRootId: id,
          uploadType: type,
          filename: name
        },
        file,
        false,
      )
      success++
      handlerUpload(type, name.split('.')[0])
    }
    catch (e: any) {
      error[name] = e.message || '未知错误'
    }
    finally {
      notify({
        caption: `上传进度：${i + 1} / ${total}`
      })
    }
  }

  showUploadResult(total, success, error, notify)
}

/**
 * 上传回调
 */
function handlerUpload(type: UploadType, name: string) {
  const { id } = props
  if (!id)
    return

  if (type === UploadType.PREVIEW && !previewResource.value[id]?.includes(name)) {
    if (!previewResource.value[id])
      previewResource.value[id] = []
    previewResource.value[id].push(name)
  }
  else if (type === UploadType.DOWNLOAD && !downloadResource.value[id]?.includes(name)) {
    if (!downloadResource.value[id])
      downloadResource.value[id] = []
    downloadResource.value[id].push(name)
  }
}
</script>

<template>
  <ZDialog
    :model-value="!!id"
    class="upload-table-data-dialog"
    title="数据资源上传"
    :loading="loading"
    :params="{
      fullWidth: true,
      fullHeight: true,
    }"
    @update:model-value="$emit('update:id', undefined)"
  >
    <div full flex="~ col gap4">
      <div flex="~ wrap" gap="x4 y2">
        <div flex="~ gap4" mr-auto>
          <template v-if="isEdit">
            <ZUpload
              :accept="CSV_FILE_TYPE.join(',')"
              :hint-message="{
                accept: '只能上传 CSV 文件',
              }"
              multiple :max-file="10000"
              @update:model-value="val => batchUploadTableDataFile(UploadType.PREVIEW, val)"
            >
              <ZBtn
                label="批量上传“样例数据”"
                :disable="disable"
              >
                <template #left>
                  <div w5 h5 i-mingcute:upload-3-line />
                </template>
              </ZBtn>
            </ZUpload>
            <ZUpload
              :accept="ZIP_FILE_TYPE.join(',')"
              :hint-message="{
                accept: '只能上传 ZIP 文件',
              }"
              multiple :max-file="10000"
              mr-auto
              @update:model-value="val => batchUploadTableDataFile(UploadType.DOWNLOAD, val)"
            >
              <ZBtn
                label="批量上传“下载数据”"
                :disable="disable"
              >
                <template #left>
                  <div w5 h5 i-mingcute:upload-3-line />
                </template>
              </ZBtn>
            </ZUpload>
          </template>
        </div>
        <div flex="~ wrap" gap="x4 y2">
          <div v-if="isEdit" px4 h10 rounded-2 bg-grey-2 text-sm flex="~ items-center">
            提示：批量上传可以使用 ctrl 或者 shift 进行文件多选
          </div>
          <ZChipSelect
            v-model="filter"
            :options="filterOptions"
            label="筛选"
            label-position="left"
            :label-width="28"
            size="medium"
            :style="{
              minWidth: '240px',
              width: `${160 * filter.length + 110}px`
            }"
          />
        </div>
      </div>

      <ZTable
        :rows="rows"
        :cols="cols.filter((_, i) => isEdit || i < cols.length - 2)"
        :params="{
          noDataLabel: '暂无数据资源记录',
        }"
        flex-1 h0
      >
        <template #body-cell-status="{ row }">
          <q-td auto-width max-w="none!">
            <UploadStatus
              :total="1"
              :preview="row.preview"
              :download="row.download"
            />
          </q-td>
        </template>
        <template #body-cell-preview="{ row }">
          <q-td text-center>
            <ZUpload
              :accept="CSV_FILE_TYPE.join(',')"
              :hint-message="{
                accept: '只能上传 CSV 文件',
              }"
              inline-flex
              @update:model-value="val => uploadTableDataFile(UploadType.PREVIEW, val, row.tableEn)"
            >
              <ZBtn label="上传" size="small" w22 />
            </ZUpload>
          </q-td>
        </template>
        <template #body-cell-download="{ row }">
          <q-td text-center>
            <ZUpload
              :accept="ZIP_FILE_TYPE.join(',')"
              :hint-message="{
                accept: '只能上传 ZIP 文件',
              }"
              inline-flex
              @update:model-value="val => uploadTableDataFile(UploadType.DOWNLOAD, val, row.tableEn)"
            >
              <ZBtn label="上传" size="small" w22 />
            </ZUpload>
          </q-td>
        </template>
      </ZTable>
    </div>
  </ZDialog>
</template>

<style lang="scss">
.upload-table-data-dialog {
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
