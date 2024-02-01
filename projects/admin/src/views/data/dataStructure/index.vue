<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType } from 'zjf-types'
import type { QTableColumn } from 'quasar'
import type { IDataDirectory } from 'zjf-types'

const { adminRole } = useUser()
const { loading, dataList, selectedId, queryDataList } = useDataRoot()

/** 是否可以编辑（清空、上传中间表） */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.DATA_UPLOAD))

/** 上传中间表弹窗 */
const uploadDialog = ref(false)
/** 上传中间表资源ID */
const uploadId = ref<IDataDirectory['id']>()
/** 清空对话框 */
const clearDialog = ref(false)

/** 表格列 */
const cols = reactive<QTableColumn[]>([
  ...cloneDeep(DATA_TABLE_COLUMNS),
  {
    name: 'upload',
    label: '数据资源结构上传',
    field: 'upload'
  },
  {
    name: 'structure',
    label: '结构',
    field: 'structure'
  },
])
/** 多选 */
const selected = ref<IDataDirectory[]>()

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
  queryDataList()
})

/**
 * 清空数据资源
 */
async function clearData() {
  if (!selected.value?.length)
    return

  loading.value = true
  try {
    await clearDataByRootIdApi(selected.value.map(v => v.id))
    Notify.create({
      type: 'success',
      message: '操作成功'
    })
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

    <div flex="~ justify-end gap4">
      <ZBtn
        label="整体预览"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
      >
        <template #left>
          <div w5 h5 i-mingcute:document-line />
        </template>
      </ZBtn>
      <ZBtn
        v-if="isEdit"
        label="清空"
        text-color="primary-1"
        :params="{
          outline: true,
        }"
        :disable="!selected?.length"
        @click="clearDialog = true"
      >
        <template #left>
          <div w5 h5 i-mingcute:delete-2-line />
        </template>
      </ZBtn>
    </div>

    <ZTable
      v-model:selected="selected"
      :rows="dataList"
      :cols="cols"
      :params="{
        noDataLabel: '暂无数据资源记录',
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-first-column
    >
      <template #body-cell-upload="{ row }">
        <q-td text-center>
          <ZBtn
            label="上传"
            size="small"
            :disable="!isEdit"
            w22
            @click="() => {
              uploadDialog = true
              uploadId = row.id
            }"
          />
        </q-td>
      </template>
      <template #body-cell-structure="{ row }">
        <q-td text-center>
          <TextBtn
            label="查看结构"
            @click="selectedId = row.id"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 清空 -->
    <ZDialog
      v-model="clearDialog"
      title="清空"
      footer
      @ok="clearData"
    >
      该操作将清空已选数据资源类型中的数据结构，是否继续？
    </ZDialog>
  </div>
</template>
