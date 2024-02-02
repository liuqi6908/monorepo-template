<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import type { QTableColumn } from 'quasar'
import type { IDataDirectory } from 'zjf-types'

import UploadDataDialog from './UploadData.dialog.vue'

const {
  loading, dataList, selectedId,
  previewResource, downloadResource,
  queryDataList, getPreviewUploadStatus,
  getDownloadUploadStatus,
} = useDataRoot()

/** 表格列 */
const cols = reactive<QTableColumn[]>([
  ...cloneDeep(DATA_TABLE_COLUMNS),
  {
    name: 'upload',
    label: '数据资源上传',
    field: 'upload'
  },
  {
    name: 'status',
    label: '上传状态',
    field: 'status'
  },
])

/** 加载状态 */
const loadingStatue = ref(true)

onBeforeMount(async () => {
  cols.forEach(v => v.align = 'center')
  queryDataList()
  try {
    await getPreviewUploadStatus()
    await getDownloadUploadStatus()
  }
  finally {
    loadingStatue.value = false
  }
})

/**
 * 返回数据资源下表格数据上传的数量
 */
const uploadCount = computed(() => {
  const obj: Record<
    IDataDirectory['id'],
    {
      total: number
      preview: number
      download: number
    }
  > = {}

  function getCount(item?: IDataDirectory[], previewArr?: string[], downloadArr?: string[]): {
    total: number
    preview: number
    download: number
  } {
    let total = 0, preview = 0, download = 0
    item?.forEach((v) => {
      if (v.level === 4) {
        total++
        if (previewArr?.includes(v.nameEN))
          preview++
        if (downloadArr?.includes(v.nameEN))
          download++
      }
      else {
        const { total: t, preview: p, download: d } = getCount(v.children, previewArr, downloadArr)
        total += t
        preview += p
        download += d
      }
    })
    return {
      total,
      preview,
      download
    }
  }

  dataList.value?.forEach((v) => {
    obj[v.id] = getCount(v.children, previewResource.value[v.id], downloadResource.value[v.id])
  })
  return obj
})
</script>

<template>
  <div full flex="~ col" relative>
    <ZLoading :value="loading" />

    <ZTable
      :rows="dataList"
      :cols="cols"
      :params="{
        noDataLabel: '暂无数据资源记录',
      }"
      flex-1 h0
    >
      <template #body-cell-upload="{ row }">
        <q-td text-center>
          <ZBtn
            label="上传"
            size="small"
            w22
            @click="selectedId = row.id"
          />
        </q-td>
      </template>
      <template #body-cell-status="{ row }">
        <q-td auto-width max-w="none!">
          <q-spinner-ios
            v-if="loadingStatue"
            color="primary"
            size="24" mx-20
          />
          <UploadStatus v-else v-bind="uploadCount[row.id]" />
        </q-td>
      </template>
    </ZTable>

    <UploadDataDialog v-model:id="selectedId" />
  </div>
</template>
