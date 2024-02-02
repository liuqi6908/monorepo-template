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
}

const props = defineProps<{
  id?: IDataDirectory['id']
}>()
defineEmits(['update:id'])

const { adminRole } = useUser()
const { loading, dataList, previewResource, downloadResource } = useDataRoot()

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
      if (v.level === 1) {
        node = pick(node, 'database')
        node.database = v.nameZH
      }
      else if (v.level === 2) {
        node = pick(node, 'database', 'bDatabase')
        node.bDatabase = v.nameZH
      }
      else if (v.level === 3) {
        node = pick(node, 'database', 'bDatabase', 'part')
        node.part = v.nameZH
      }
      else if (v.level === 4) {
        node.table = v.nameZH
        node.tableEn = v.nameEN
        nodes.push(node)
      }

      if (v.level !== 4 && v.children?.length)
        processingData(v.children, nodes, node)
    })
    return { nodes, parent }
  }

  return processingData(data).nodes
})

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
    await uploadTableDataApi({
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
      await uploadTableDataApi(
        {
          dataRootId: id,
          uploadType: type,
          filename: name
        },
        file,
        {
          headers: { notify: false }
        }
      )
      success++
      handlerUpload(type, name.split('.')[0])
    }
    catch (e: any) {
      error[name] = e.response?.data?.message || '未知错误'
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
      <div v-if="isEdit" flex="~ wrap" gap="x4 y2">
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
        <div px4 h10 rounded-2 bg-grey-2 text-sm flex="~ items-center">
          提示：批量上传可以使用 ctrl 或者 shift 进行文件多选
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
              :preview="previewResource[id!]?.includes(row.tableEn) ? 1 : 0"
              :download="downloadResource[id!]?.includes(row.tableEn) ? 1 : 0"
            />
          </q-td>
        </template>
        <template #body-cell-preview="{ row }">
          <q-td>
            <ZUpload
              :accept="CSV_FILE_TYPE.join(',')"
              :hint-message="{
                accept: '只能上传 CSV 文件',
              }"
              @update:model-value="val => uploadTableDataFile(UploadType.PREVIEW, val, row.tableEn)"
            >
              <ZBtn label="上传" size="small" w22 />
            </ZUpload>
          </q-td>
        </template>
        <template #body-cell-download="{ row }">
          <q-td>
            <ZUpload
              :accept="ZIP_FILE_TYPE.join(',')"
              :hint-message="{
                accept: '只能上传 ZIP 文件',
              }"
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
