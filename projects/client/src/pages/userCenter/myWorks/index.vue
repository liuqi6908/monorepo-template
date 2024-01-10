<script setup lang="ts">
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IWork } from 'zjf-types'
import moment from 'moment'
import AddWorksDialog from '~/views/userCenter/myWorks/AddWorks.dialog.vue'

const { works, getWorkConfig } = useSysConfig()

/** 加载中 */
const loading = ref(false)
/** 增加/编辑 作品对话框 */
const dialog = ref(false)
/** 修改的作品 */
const work = ref<IWork>()
/** 删除 作品的id */
const deleteId = ref<string>()

/** 表格列字段 */
const tableCols = reactive<Required<QTableProps>['columns']>([
  {
    name: 'title',
    label: '题目',
    field: 'title',
  },
  {
    name: 'author',
    label: '作者',
    field: 'author',
  },
  {
    name: 'filename',
    label: '文件名称',
    field: 'filename',
  },
  {
    name: 'createdAt',
    label: '上传时间',
    field: (row: IWork) => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    name: 'updatedAt',
    label: '修改时间',
    field: (row: IWork) => {
      if (row.createdAt === row.updatedAt)
        return '—'
      return moment(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    name: 'operate',
    field: 'operate',
    label: '操作',
  },
])
/** 表格行信息 */
const tableRows = ref<(IWork)[]>()

onBeforeMount(() => {
  tableCols.forEach(v => v.align = 'center')
  queryWorks()
  getWorkConfig()
})

/**
 * 查询所有的作品
 */
async function queryWorks() {
  loading.value = true
  try {
    tableRows.value = (await queryOwnWorksApi({
      sort: [
        {
          field: 'updatedAt',
          order: 'DESC'
        }
      ]
    })).data
  }
  finally {
    loading.value = false
  }
}

/**
 * 删除指定作品
 */
async function deleteWork() {
  if (!deleteId.value)
    return

  loading.value = true
  try {
    const res = await deleteWorkApi(deleteId.value)
    if (res) {
      Notify.create({
        message: '删除成功',
        type: 'success',
      })
    }
    await queryWorks()
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div relative flex="~ col gap10">
    <ZLoading :value="loading" />
    <div flex="~ justify-between">
      <ZBtn
        label="增加作品"
        self-start size="big"
        @click="dialog = true"
      >
        <template #icon>
          <div text-xl i-material-symbols:add />
        </template>
      </ZBtn>
      <div
        v-if="works?.amount"
        px4 bg-grey-2 flex-center
        v-text="`作品上传数量限制：${tableRows?.length} / ${works.amount}`"
      />
    </div>
    <Empty
      v-if="!tableRows?.length"
      label="您还未添加任何作品"
      captions="点击左上角增加作品按钮，可以上传作品"
    />
    <div v-else flex="~ col gap3">
      <div font-600>
        我的作品
      </div>
      <ZTable
        :cols="tableCols"
        :rows="tableRows"
      >
        <template #body-cell-operate="props">
          <td flex="~ justify-center gap4">
            <ZBtn
              label="重新上传"
              size="small" w22
              text-color="primary-1"
              :params="{
                outline: true
              }"
              @click="() => {
                dialog = true
                work = props.row
              }"
            />
            <ZBtn
              label="删除"
              size="small" w22
              text-color="alerts-error"
              :params="{
                outline: true
              }"
              @click="deleteId = props.row.id"
            />
          </td>
        </template>
      </ZTable>
    </div>

    <!-- 增加/编辑 作品对话框 -->
    <AddWorksDialog
      :model-value="dialog"
      :work="work"
      @update:model-value="() => {
        dialog = false
        work = undefined
      }"
      @queryWorks="queryWorks"
    />

    <!-- 删除对话框 -->
    <ZDialog
      :model-value="!!deleteId"
      title="删除作品"
      confirm-text="删除"
      footer
      @update:model-value="deleteId = undefined"
      @ok="deleteWork"
    >
      确认删除该作品？删除后不可恢复！
    </ZDialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
