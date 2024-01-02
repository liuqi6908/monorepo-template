<script lang="ts" setup>
import { Notify } from 'quasar'
import type { DESKTOP_REQUEST_DURATION_OPTION } from 'zjf-types'
import type { Protocol } from '~/components/protocol/index.vue'

const props = defineProps<{
  modelValue: boolean
}>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { app, desktop, getDesktopConfig } = useSysConfig()
const { getDesktopRequest } = useDesktop()

/** 加载中 */
const loading = ref(false)
/** 申请时长 */
const duration = ref<typeof DESKTOP_REQUEST_DURATION_OPTION[0]>()
/** 附件 */
const files = ref<File[]>()
const attachments = ref<{
  file: string
  name: string
}[]>([])
/** 用户协议 */
const checked = ref(false)

/** 协议列表 */
const protocolList = ref<Protocol[]>([
  {
    label: `「${app.value?.name}」云桌面使用协议`,
    component: shallowRef(defineAsyncComponent(() => import('~/components/protocol/DesktopDoc.vue')))
  }
])

onBeforeMount(async () => {
  loading.value = true
  await getDesktopConfig()
  duration.value = desktop.value?.duration?.[0]
  loading.value = false
})

/** 禁用提交 */
const disableConfirm = computed(() => !duration.value || !attachments.value.length || !checked.value)
/** 禁用上传 */
const disableUpload = computed(() => !desktop.value?.amountLimit || attachments.value.length >= desktop.value.amountLimit)

watch(
  files,
  async (newVal) => {
    loading.value = true
    try {
      // 上传附件
      if (newVal?.length) {
        for (const file of newVal) {
          if (!attachments.value.find(v => v.file === file.name)) {
            const res = await uploadDesktopRequestAttachmentsApi(file)
            attachments.value.push({
              file: file.name,
              name: res
            })
          }
        }
      }
      // 删除附件
      if (attachments.value.length) {
        for (let i = attachments.value.length - 1; i >= 0; i--) {
          if (!newVal?.find(v => v.name === attachments.value[i].file))
            attachments.value.splice(i, 1)
        }
      }
    }
    finally {
      loading.value = false
    }
  }
)

/**
 * 提交云桌面申请
 */
async function confirm() {
  if (disableConfirm.value || loading.value)
    return

  loading.value = true
  try {
    const res = await createDesktopRequestApi({
      duration: duration.value!.value,
      attachments: attachments.value.map(v => v.name)
    })
    if (res) {
      Notify.create({
        message: '申请成功',
        type: 'success',
      })
      await getDesktopRequest()
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <ZDialog
    v-model="value"
    title="申请使用"
    caption="（申请结果前往“用户中心查看”）"
    :wrapper-style="{
      width: '488px',
    }"
    footer
    confirm-text="提交"
    :loading="loading"
    :disable-confirm="disableConfirm"
    @ok="confirm"
  >
    <div flex="~ col gap6">
      <ZSelect
        v-model="duration"
        :options="desktop?.duration"
        label="云桌面使用时长"
        placeholder="请选择云桌面使用时长"
      />
      <ZUpload
        v-model="files"
        label="研究计划/其他材料"
        btn-label="提交文件"
        :hint="desktop?.hint"
        required
        :accept="desktop?.acceptLimit?.map(v => `.${v}`).join(',')"
        :multiple="true"
        :max-files="desktop?.amountLimit"
        :max-file-size="desktop?.sizeLimit"
        :disable="disableUpload"
        showFileList
      />
      <Protocol
        v-model="checked"
        :list="protocolList"
      />
    </div>
  </ZDialog>
</template>
