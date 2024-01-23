<script lang="ts" setup>
import { Notify } from 'quasar'
import type { Protocol } from '~/components/protocol/index.vue'

const props = defineProps<{
  modelValue?: boolean
}>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { getVerify } = useUser()
const { app, verification, getVerificationConfig } = useSysConfig()

/** 加载中 */
const loading = ref(false)

/** 认证表单 */
const verifyForm = reactive({
  school: '',
  college: '',
  idCard: '',
  number: '',
  name: '',
  dataRole: '',
})
/** 附件 */
const files = ref<File[]>()
const attachments = ref<{
  file: string
  name: string
}[]>([])
/** 用户协议 */
const checked = ref(false)

/** 数据角色名称 */
const dataRoleNames = ref<string[]>()
/** 协议列表 */
const protocolList = computed<Protocol[]>(() => [
  {
    label: `「${app.value?.name}」隐私政策`,
    component: defineAsyncComponent(() => import('~/components/protocol/PrivacyDoc.vue'))
  },
  {
    label: `「${app.value?.name}」用户使用协议`,
    component: defineAsyncComponent(() => import('~/components/protocol/UserAgreementDoc.vue'))
  }
])

/** 禁用提交 */
const disableConfirm = computed(() => {
  const { school, college, idCard, number, name, dataRole } = verifyForm
  return !!validateSchool(school)
    || !!validateCollege(college)
    || !!validateIdCard(idCard)
    || !!validateNumber(number)
    || !!validateName(name)
    || !dataRole
    || !attachments.value.length
    || !checked.value
})
/** 禁用上传 */
const disableUpload = computed(() => (
  !verification.value?.amountLimit
  || attachments.value.length >= verification.value.amountLimit
))

onBeforeMount(async () => {
  loading.value = true
  dataRoleNames.value = await getDataRoleNamesApi()
  await getVerificationConfig()
  loading.value = false
})

watch(
  files,
  async (newVal) => {
    loading.value = true
    try {
      // 上传附件
      if (newVal?.length) {
        for (const file of newVal) {
          if (!attachments.value.find(v => v.file === file.name)) {
            const res = await uploadVerifyAttachmentsApi(file)
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
 * 提交认证申请
 */
async function confirm() {
  if (disableConfirm.value)
    return

  const res = await createVerificationApi({
    ...verifyForm,
    attachments: attachments.value.map(v => v.name),
  })
  if (res) {
    Notify.create({
      message: '认证成功',
      type: 'success',
    })
    getVerify()
  }
}
</script>

<template>
  <ZDialog
    v-model="value"
    title="需要完善信息并且通过审核"
    :wrapper-style="{
      width: '560px',
    }"
    footer scroll
    confirm-text="提交申请"
    :disable-confirm="disableConfirm"
    :loading="loading"
    @ok="confirm"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="verifyForm.school"
        label="学校名称"
        placeholder="请输入学校名称"
        required
        :params="{
          rules: [
            (val: string) => validateSchool(val) || true
          ]
        }"
      />
      <ZInput
        v-model="verifyForm.college"
        label="所在学院"
        placeholder="请输入学院名称"
        required
        :params="{
          rules: [
            (val: string) => validateCollege(val) || true
          ]
        }"
      />
      <ZInput
        v-model="verifyForm.idCard"
        label="身份证号码"
        placeholder="请输入身份证号码"
        required
        :params="{
          rules: [
            (val: string) => validateIdCard(val) || true
          ]
        }"
      />
      <ZInput
        v-model="verifyForm.number"
        label="学号/工号"
        placeholder="请输入学号/工号"
        required
        :params="{
          rules: [
            (val: string) => validateNumber(val) || true
          ]
        }"
      />
      <ZInput
        v-model="verifyForm.name"
        label="姓名"
        placeholder="请输入您的真实姓名"
        required
        :params="{
          rules: [
            (val: string) => validateName(val) || true
          ]
        }"
      />
      <ZSelect
        v-model="verifyForm.dataRole"
        :options="dataRoleNames"
        label="身份（用户角色）"
        placeholder="请选择您的身份"
        required
      />
      <ZUpload
        v-model="files"
        label="上传资料"
        :btn-label="`选择图片（最多${verification?.amountLimit}张）`"
        :hint="verification?.hint"
        required
        :accept="verification?.acceptLimit?.map(v => `.${v}`).join(',')"
        :multiple="true"
        :max-files="verification?.amountLimit"
        :max-file-size="verification?.sizeLimit"
        :disable="disableUpload"
        show-file-list
        type="image"
        my5
      />
      <Protocol
        v-model="checked"
        :list="protocolList"
      />
    </div>
  </ZDialog>
</template>
