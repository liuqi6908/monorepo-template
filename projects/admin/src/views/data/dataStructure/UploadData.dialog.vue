<script lang="ts" setup>
import { Notify } from 'quasar'
import { PermissionType } from 'zjf-types'
import { browser, NAME_EN_REQUIREMENTS_DESC, NAME_ZH_REQUIREMENTS_DESC } from 'zjf-utils'
import type { IDataRootIdDto } from 'zjf-types'

interface Props {
  modelValue?: boolean
  id?: IDataRootIdDto['dataRootId']
}

const props = defineProps<Props>()
defineEmits(['update:modelValue'])

const { adminRole } = useUser()

/** 是否可以编辑（清空、上传中间表） */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.DATA_UPLOAD) && !!props.id)

/** 对话框 */
const value = useVModel(props, 'modelValue')
/** 加载中 */
const loading = ref(false)
/** 是否动态数据层级 */
const isDynamicData = computed(() => getEnvVariable('VITE_DYNAMIC_DATA_LIST'))
/** 字段说明 */
const fieldDesc = computed(() => {
  const text = `${isDynamicData.value ? '选' : '必'}填项`
  return [
    '数据库（level-1），必填项，一个数据资源中必须有一个或者多个数据库',
    '数据库英文名，必填项',
    `子库（level-2），${text}，一个数据库下可以有多个子库${isDynamicData.value ? '，也可以不设置子库' : ''}`,
    `子库英文名，${text}${isDynamicData.value ? '，当子库字段存在时，此项必填' : ''}`,
    `模块（level-3），${text}，一个子库下可以有多个模块${isDynamicData.value ? '，也可以不设置模块' : ''}`,
    `模块英文名，${text}${isDynamicData.value ? '，当模块字段存在时，此项必填' : ''}`,
    `表（level-4），必填项，一个${isDynamicData.value ? '数据库' : '模块'}中必须有一个或者多个表格`,
    '表英文名，必填项',
    '字段（variable），必填项，每个表格至少有一个字段',
    '字段英文名，必填项',
    '字段说明（variable-describe），选填项',
    '排序（order），选填项，自定义数据资源排列顺序'
  ]
})

/**
 * 下载模版
 */
function downloadTemplate () {
  browser.downloadCsv(
    fieldDesc.value.map((v) => {
      let text = v
      if (v.includes('英文名'))
        text += `（${NAME_EN_REQUIREMENTS_DESC}）`
      else if (v.includes('level') || v.includes('（variable）'))
        text += `（${NAME_ZH_REQUIREMENTS_DESC}）`
      return text
    }).join(','),
    '数据资源结构设置样例'
  )
}

/**
 * 上传数据结构
 */
async function uploadDataStructure(file: File) {
  if (!file)
    return

  const suffix = file.name.split('.').pop()
  if (suffix?.toLowerCase() !== 'csv') {
    Notify.create({
      color: 'danger',
      message: '只能上传 CSV 文件',
    })
    return
  }

  loading.value = true
  try {
    await updateIntermediateTableApi(props.id!, file, {
      dynamic: isDynamicData.value,
      clear: true,
    })
    Notify.create({
      type: 'success',
      message: '上传成功',
    })
  }
  finally {
    loading.value = false
    value.value = false
  }
}
</script>

<template>
  <ZDialog
    v-model="value"
    class="upload-data-structure-dialog"
    title="数据资源结构上传"
    :wrapper-style="{
      maxWidth: '696px',
      width: '696px',
    }"
    :loading="loading"
  >
    <div flex="~ col gap10">
      <div flex="~ col gap4" text-sm font-400>
        <div>
          请参考样例数据（
          <TextBtn
            label="【数据资源结构设置样例.csv】"
            @click="downloadTemplate"
          />
          &lt;--点击下载 ），进行数据资源结构设置。
        </div>
        <div>
          注意：【数据资源结构设置样例.csv】 中以一维表结构存储数据资源结构，导入到系统后，自动转换为树型结构，可以点击“查看结构”按钮查看上传的资源结构。【数据资源结构设置样例.csv】中的字段说明如下：
        </div>
        <div flex="~ col gap1">
          <div
            v-for="(item, index) in fieldDesc"
            :key="index"
            v-text="item"
          />
        </div>
      </div>
      <footer flex="~ justify-end gap6">
        <ZBtn
          v-close-popup
          min-w-28
          label="取消"
          text-color="primary-1"
          :params="{
            outline: true,
          }"
        />
        <ZUpload
          accept="text/csv,application/vnd.ms-excel"
          :hint-message="{
            accept: '只能上传 CSV 文件'
          }"
          :disable="!isEdit"
          @update:model-value="val => uploadDataStructure(val)"
        >
          <ZBtn
            label="数据资源结构上传（仅支持 CSV 格式）"
            :disable="!isEdit"
          />
        </ZUpload>
      </footer>
    </div>
  </ZDialog>
</template>

<style lang="scss">
.upload-data-structure-dialog {
  .q-dialog__inner {
    > .q-card {
      > div:last-child {
        padding: 0 24px;
      }
    }
  }
}
</style>
