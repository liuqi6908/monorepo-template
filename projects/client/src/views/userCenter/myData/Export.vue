<script lang="ts" setup>
import { Notify } from 'quasar'
import { formatFileSize, isCompressedFile } from 'zjf-utils'
import type { FileType } from '~/constants/export'
import ChangeEmailDialog from '../authentication/ChangeEmail.dialog.vue'

type ExportForm = Record<FileType, {
  note: string
  file?: File
}>

const { app, fileExport, getFileExportConfig } = useSysConfig()

/** 当前页面 */
const value = ref(EXPORT_MENU[0].value)
/** 加载中 */
const loading = ref(false)
/** 外发表单 */
const exportForm = reactive<ExportForm>({
  small: {
    note: '',
    file: undefined,
  },
  big: {
    note: '',
    file: undefined,
  },
})
/** 更改邮箱对话框 */
const changeEmail = ref(false)

/** 外发信息 */
const exportInfo = computed(() => ({
  small: {
    info: [
      `（1）支持 ${formatFileSize(fileExport.value?.sizeLimitSm ?? 0)} 及以内的文件，每日外发次数上限为${fileExport.value?.dailyLimit}次；`,
      '（2）无需审核，快速通过；',
      '（3）禁止外发原始数据；',
      '（4）禁止外发 .zip、.rar 等压缩文件；',
      `（5）外发标准详见“${app.value?.name}”的常见问题解答板块。`,
    ],
    size: fileExport.value?.sizeLimitSm,
    limit: fileExport.value?.dailyLimit,
  },
  big: {
    info: [
      `（1）支持 ${formatFileSize(fileExport.value?.sizeLimitLg ?? 0)} 及以内的文件外发，每日外发次数不限；`,
      '（2）管理员将在1 - 2个工作日内，完成外发数据的审核；',
      '（3）禁止外发原始数据；',
      '（4）不符合外发标准的文件将被驳回，符合条件的文件将发送至您的邮箱；',
      '（5）支持 .zip、.rar 等文件的外发；',
      `（6）外发文件审核标准见“${app.value?.name}”的常见问题解答板块。`,
    ],
    size: fileExport.value?.sizeLimitLg,
  },
}))

onBeforeMount(async () => {
  loading.value = true
  await getFileExportConfig()
  loading.value = false
})

watch(
  () => exportForm.small.file,
  (newVal) => {
    if (newVal && isCompressedFile(newVal)) {
      exportForm.small.file = undefined
      Notify.create({
        message: '禁止外发压缩文件',
        type: 'danger'
      })
    }
  }
)

/**
 * 外发文件
 */
async function exportFile() {
  const form = exportForm[value.value]
  if (!form.file)
    return

  loading.value = true
  try {
    let res, message
    if (value.value === 'big') {
      res = await exportLgApi(form.file, form.note)
      message = '外发成功，请等待管理员审核！'
    }
    else {
      res = await exportSmApi(form.file, form.note)
      message = '外发成功，请前往邮箱查看！'
    }
    if (res) {
      Notify.create({
        message,
        type: 'success',
      })
      exportForm[value.value].file = undefined
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div relative flex="~ col gap6">
    <ZLoading :value="loading" />
    <ZBtnToggle v-model="value" :options="EXPORT_MENU" self-center />
    <div flex="~ col gap10">
      <div flex="~ col gap4 items-center" p4 bg-grey-2 text-sm font-400>
        <div flex="~ col gap2">
          <div
            v-for="(item, index) in exportInfo[value].info"
            :key="index"
            v-text="item"
          />
        </div>
        <div text-alert-error>
          注：您的所有数据外发行为将被保留，用于平台行为审查，请严格遵守平台外发规则！
        </div>
      </div>
      <div text="sm alert-error" font-400 p="y2 x4" bg="alert-error/8">
        您申请外发的文件，可能被误认为垃圾邮件。若您在【收件箱】中无法查找到该邮件，请前往【垃圾邮件】查看，或者您可以将 noreply@qiyandata.com 添加为可信任的电子邮箱
      </div>
      <div flex="~ col gap8">
        <ZInput
          v-model="exportForm[value].note"
          label="备注信息"
          placeholder="请输入备注信息"
          :params="{
            type: 'textarea',
            maxlength: 255
          }"
        />
        <ZDragUpload
          v-model="exportForm[value].file"
          label="选择文件"
          caption="（将需要外发的文件，拖拽至此框内，或点击一下按钮上传文件）"
          required
          :maxFileSize="exportInfo[value].size"
        />
        <div flex="~ gap8 self-center">
          <ZBtn
            label="更改邮箱"
            size="big" w36
            text-color="primary-1"
            :params="{
              outline: true,
            }"
            @click="changeEmail = true"
          />
          <ZBtn
            label="外发"
            size="big" w36
            :disable="!exportForm[value].file"
            @click="exportFile"
          />
        </div>
      </div>
    </div>

    <!-- 修改邮箱对话框 -->
    <ChangeEmailDialog v-model="changeEmail" />
  </div>
</template>
