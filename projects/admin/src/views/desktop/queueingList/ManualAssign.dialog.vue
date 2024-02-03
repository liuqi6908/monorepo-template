<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import type { IDesktop, IUser } from 'zjf-types'
import type { QTableProps } from 'quasar'

interface Props {
  modelValue?: boolean
  id?: IUser['id']
}

const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'callback'])

const dialog = useVModel(props, 'modelValue')

/** 加载中 */
const loading = ref(false)

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive(cloneDeep(DESKTOP_TABLE_COLUMNS))
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)
/** 选中的云桌面 */
const desktop = ref<IDesktop>()

watch(
  dialog,
  (newVal) => {
    if (newVal) {
      desktop.value = undefined
      pagination.value.sortBy = 'createdAt'
      pagination.value.descending = true
    }
  }
)

onBeforeMount(() => {
  cols.splice(5, 1)
  cols.pop()
  cols.forEach(v => v.align = 'center')
})

/**
 * 查询云桌面列表
 */
const queryDesktopList: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const { total, data } = await queryDesktopApi({
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'disabled',
          type: '=',
          value: false,
        },
        {
          field: 'userId',
          type: 'IS NULL',
        },
      ],
      sort: [
        {
          field: sortBy as keyof IDesktop,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
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
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
    loading.value = false
    desktop.value = undefined
  }
}

/**
 * 分配云桌面
 */
async function assignDesktop() {
  const { id } = props
  if (!id || !desktop.value)
    return

  const res = await assignDesktopApi(desktop.value.id, id)
  if (res) {
    Notify.create({
      type: 'success',
      message: '操作成功',
    })
    emits('callback')
  }
}
</script>

<template>
  <ZDialog
    v-model="dialog"
    class="manual-assign-desktop-dialog"
    title="手动分配"
    footer
    confirm-text="保存"
    :disable-confirm="!desktop"
    :loading="loading"
    :params="{
      fullWidth: true,
      fullHeight: true,
    }"
    @ok="assignDesktop"
  >
    <ZTable
      v-model:pagination="pagination"
      :rows="rows"
      :cols="cols"
      :params="{
        noDataLabel: '暂无云桌面信息记录',
        binaryStateSort: true,
        selection: 'multiple',
      }"
      full
      fixed-first-column
      @request="queryDesktopList"
    >
      <template #header-selection>
        选择
      </template>
      <template #body-selection="{ row }">
        <ZRadio
          :model-value="desktop?.id"
          :val="row.id"
          @update:model-value="desktop = row"
        />
      </template>
    </ZTable>
  </ZDialog>
</template>

<style lang="scss">
.manual-assign-desktop-dialog {
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
