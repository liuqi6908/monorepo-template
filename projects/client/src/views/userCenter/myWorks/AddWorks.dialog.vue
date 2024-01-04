<script lang="ts" setup>
import { Notify } from 'quasar'
import type { IWork } from 'zjf-types'
import type { Protocol } from '~/components/protocol/index.vue'

interface Props {
  modelValue?: boolean
  work?: IWork
}

const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'queryWorks'])

const value = useVModel(props, 'modelValue')
const { app, works, getWorkConfig } = useSysConfig()

/** 加载中 */
const loading = ref(false)

/** 题目 */
const title = ref<string>()
/** 作者 */
const author = ref<string>()
/** 附件 */
const file = ref<File>()
/** 用户协议 */
const checked = ref(false)

/** 协议列表 */
const protocolList = computed<Protocol[]>(() => [
  {
    label: `「${app.value?.name}」用户作品上传协议`,
    component: defineAsyncComponent(() => import('~/components/protocol/WorksDoc.vue'))
  }
])

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      const { work } = props
      title.value = work?.title
      author.value = work?.author
      file.value = undefined
      checked.value = false
    }
  }
)

/** 禁用提交 */
const disableConfirm = computed(() => !title.value || !author.value || !file.value || !checked.value)

onBeforeMount(async () => {
  loading.value = true
  await getWorkConfig()
  loading.value = false
})

/**
 * 新增作品
 */
async function confirm() {
  if (disableConfirm.value)
    return

  const id = props.work?.id
  let res
  if (id)
    res = await updateWorkApi(id, file.value!, title.value!, author.value!)
  else
    res = await createWorkApi(file.value!, title.value!, author.value!)
  if (res) {
    Notify.create({
      message: `${id ? '修改' : '增加'}成功`,
      type: 'success',
    })
    emits('queryWorks')
  }
}
</script>

<template>
  <ZDialog
    v-model="value"
    :title="`${props.work?.id ? '修改' : '增加'}作品`"
    :wrapper-style="{
      width: '488px',
    }"
    footer
    confirm-text="提交"
    :disable-confirm="disableConfirm"
    :loading="loading"
    @ok="confirm"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="title"
        label="题目"
        placeholder="请输入题目"
        required
        :params="{
          rules: [
            (val: string) => !val ? '请输入题目' : true
          ]
        }"
      />
      <ZInput
        v-model="author"
        label="作者"
        placeholder="请输入作者"
        required
        :params="{
          rules: [
            (val: string) => !val ? '请输入作者' : true
          ]
        }"
      />
      <ZUpload
        v-model="file"
        label="上传资料"
        btn-label="选择文件"
        :hint="works?.hint"
        required
        :accept="works?.acceptLimit?.map(v => `.${v}`).join(',')"
        :max-file-size="works?.sizeLimit"
        showFileList
        mb5
      />
      <Protocol
        v-model="checked"
        :list="protocolList"
      />
    </div>
  </ZDialog>
</template>
