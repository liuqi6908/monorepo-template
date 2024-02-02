<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { pick } from 'zjf-utils'
import { MinioBucket, PermissionType } from 'zjf-types'
import type { QTableColumn } from 'quasar'
import type { Resource } from '~/composables/dataRoot'

import ViewIntroduceDialog from './ViewIntroduce.dialog.vue'

interface TableRow {
  id: string
  nameZH: string
  nameEN: string
  databaseId: string
  database: string
  databaseEN: string
  reference?: string
}

const { loading, dataList, selectedId, queryDataList } = useDataRoot()
const { adminRole } = useUser()

/** 数据库介绍上传情况 */
const introResource = ref<Resource>({})
/** 编辑引用规范对话框 */
const referenceDialog = ref(false)
/** 编辑引用规范 */
const reference = ref<string>()

/** 表格列 */
const cols = reactive<QTableColumn[]>([
  ...cloneDeep(DATA_TABLE_COLUMNS),
  {
    name: 'database',
    label: '数据库',
    field: 'database'
  },
  {
    name: 'status',
    label: '上传状态',
    field: 'status'
  },
])
/** 表格行 */
const rows = computed<TableRow[]>(() => {
  const arr: TableRow[] = []
  dataList.value?.forEach((root) => {
    root.children?.forEach((database) => {
      arr.push({
        ...pick(root, 'id', 'nameZH', 'nameEN'),
        databaseId: database.id,
        database: database.nameZH,
        databaseEN: database.nameEN,
        reference: database.reference,
      })
    })
  })
  return arr
})
/** 单选 */
const selected = ref<TableRow>()

/** 加载状态 */
const loadingStatue = ref(true)

onBeforeMount(async () => {
  cols.forEach(v => v.align = 'center')
  queryDataList()
  try {
    await getIntroUploadStatus()
  }
  finally {
    loadingStatue.value = false
  }
})

/**
 * 获取数据库介绍上传情况
 */
async function getIntroUploadStatus() {
  introResource.value = {}
  loading.value = true

  try {
    const res = await getFolderFilesApi({
      bucket: MinioBucket.PRIVATE,
      path: 'db/intro',
    })
    res?.forEach((v) => {
      const path = v.name.split('/')
      const key = path[2]
      const name = path.pop()?.split('.').shift()
      if (key && name) {
        if (!introResource.value[key])
          introResource.value[key] = []
        introResource.value[key].push(name)
      }
    })
  }
  finally {
    loading.value = false
  }
}

/**
 * 上传数据库介绍
 */
async function uploadIntro(file: File) {
  if (!file || !selected.value)
    return

  try {
    loading.value = true
    const { id, databaseEN } = selected.value
    await uploadDbIntroApi(file, id, `${databaseEN}.docx`)
    Notify.create({
      type: 'success',
      message: '上传成功',
    })
    if (!introResource.value[id]?.includes(databaseEN)) {
      if (!introResource.value[id])
        introResource.value[id] = []
      introResource.value[id].push(databaseEN)
    }
  }
  finally {
    selected.value = undefined
    loading.value = false
  }
}

/**
 * 编辑引用规范
 */
async function editReference() {
  if (!reference.value || !selected.value)
    return

  try {
    loading.value = true
    const { databaseId } = selected.value
    await updateReferenceApi(databaseId, {
      reference: reference.value,
    })
    Notify.create({
      type: 'success',
      message: '编辑成功',
    })
    await queryDataList()
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

    <div flex="~ wrap" gap="x4 y2">
      <div flex="~ gap4" mr-auto>
        <ZUpload
          v-if="adminRole?.includes(PermissionType.DATA_UPLOAD_INTRO)"
          accept=".docx"
          :hint-message="{
            accept: '只能上传 DOCX 文件',
          }"
          :disable="!selected"
          @update:model-value="val => uploadIntro(val)"
        >
          <ZBtn
            label="上传数据库介绍"
            :disable="!selected"
          >
            <template #left>
              <div w5 h5 i-mingcute:upload-3-line />
            </template>
          </ZBtn>
        </ZUpload>
        <ZBtn
          v-if="adminRole?.includes(PermissionType.DATA_EDIT_REFERENCE)"
          label="编辑引用规范"
          text-color="primary-1"
          :params="{
            outline: true,
          }"
          :disable="!selected"
          @click="() => {
            referenceDialog = true
            reference = selected?.reference
          }"
        >
          <template #left>
            <div w5 h5 i-mingcute:edit-2-line />
          </template>
        </ZBtn>
      </div>
      <ZBtn
        label="数据库介绍预览"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
        :disable="!selected"
        @click="selectedId = selected?.databaseId"
      >
        <template #left>
          <div w5 h5 i-mingcute:document-line />
        </template>
      </ZBtn>
    </div>

    <ZTable
      :rows="rows"
      :cols="cols"
      :params="{
        rowKey: 'databaseId',
        noDataLabel: '暂无数据资源记录',
        selection: 'multiple',
      }"
      flex-1 h0
    >
      <template #header-selection>
        选择
      </template>
      <template #body-selection="{ row }">
        <ZRadio
          :model-value="selected?.databaseId"
          :val="row.databaseId"
          @update:model-value="selected = row"
        />
      </template>
      <template #body-cell-status="{ row }">
        <q-td auto-width max-w="none!">
          <q-spinner-ios
            v-if="loadingStatue"
            color="primary"
            size="24" mx-20
          />
          <UploadStatus
            v-else
            :total="1"
            :preview="introResource[row.id]?.includes(row.databaseEN) ? 1 : 0"
            :download="row.reference ? 1 : 0"
            preview-text="数据库介绍"
            download-text="引用规范"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 引用规范 -->
    <ZDialog
      v-model="referenceDialog"
      title="编辑引用规范"
      footer
      confirm-text="保存"
      :disable-confirm="!reference"
      @ok="editReference"
    >
      <ZInput
        v-model="reference"
        label="引用规范"
        placeholder="请输入引用规范"
        required
        type="textarea"
      />
    </ZDialog>

    <ViewIntroduceDialog v-model:id="selectedId" />
  </div>
</template>
