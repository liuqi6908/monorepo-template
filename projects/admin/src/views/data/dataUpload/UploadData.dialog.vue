<script lang="ts" setup>
import { PermissionType } from 'zjf-types'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IDataDirectory } from 'zjf-types'

const props = defineProps<{
  id?: IDataDirectory['id']
}>()
defineEmits(['update:id'])

const { adminRole } = useUser()
const { loading, dataList } = useDataRoot()

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
const rows = computed<QTableProps['rows']>(() => {
  const data = dataList.value?.find(v => v.id === props.id)?.children
  const tables = []
  return []
})

onBeforeMount(() => {
  cols.forEach(v => v.align = 'center')
})
</script>

<template>
  <ZDialog
    :model-value="!!id"
    class="upload-table-data-dialog"
    title="数据资源上传"
    footer
    :loading="loading"
    :params="{
      fullWidth: true,
      fullHeight: true,
    }"
    @update:model-value="$emit('update:id', undefined)"
  >
    <div full flex="~ col gap4">
      <div v-if="isEdit" flex="~ wrap" gap="x4 y2">
        <ZBtn
          label="批量上传“样例数据”"
          :disable="disable"
        >
          <template #left>
            <div w5 h5 i-mingcute:upload-3-line />
          </template>
        </ZBtn>
        <ZBtn
          label="批量上传“下载数据”"
          :disable="disable"
          mr-auto
        >
          <template #left>
            <div w5 h5 i-mingcute:upload-3-line />
          </template>
        </ZBtn>
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
      />
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
