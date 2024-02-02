<script lang="ts" setup>
import moment from 'moment'
import { PermissionType, VerificationStatus, verificationStatusDescriptions } from 'zjf-types'
import type { IUser, IVerificationHistory } from 'zjf-types'
import { isClient } from '@vueuse/core';

interface Props {
  user?: IUser
  verify?: IVerificationHistory
}

interface UserInfo {
  label: string
  list: {
    label: string
    value: any
    required?: boolean
    flag?: boolean
    type?: 'radio' | 'image'
  }[]
}

const props = defineProps<Props>()

const vPreview = shallowRef()
if (isClient) {
  import('vue3-image-preview').then((module) => {
    vPreview.value = module.vPreview
  })
}

const { adminRole, isPhone } = useUser()

/** 对话框 */
const dialog = ref(false)

/** 用户id */
const userId = computed(() => props.user?.id ?? props.verify?.founder?.id)
/** 用户信息 */
const userInfo = computed<UserInfo[]>(() => {
  const base = props.user ?? props.verify?.founder
  const verify = props.user?.verification ?? props.verify
  const required = !!verify?.status
  const adminAdd = verify?.status && !verify.attachments.length

  return [
    {
      label: '基本信息',
      list: [
        {
          label: '用户名',
          value: base?.account,
          required: true,
        },
        {
          label: '账号状态',
          value: base?.isDeleted,
          type: 'radio',
        },
        {
          label: '邮箱',
          value: base?.email,
          required: true,
        },
        {
          label: '手机',
          value: base?.phone,
          flag: isPhone.value,
        },
        {
          label: '注册时间',
          value: base?.createdAt ? moment(base?.createdAt).format('YYYY-MM-DD HH:mm:ss') : '',
        },
      ]
    },
    {
      label: '权限信息',
      list: [
        {
          label: '用户角色',
          value: base?.dataRole?.name,
        },
        {
          label: '管理员角色',
          value: base?.role?.name,
        },
      ]
    },
    {
      label: '认证信息',
      list: [
        {
          label: '认证状态',
          value: verify?.status ? verificationStatusDescriptions[verify.status] : '',
        },
        {
          label: '认证时间',
          value: verify?.createdAt ? moment(verify?.createdAt).format('YYYY-MM-DD HH:mm:ss') : '',
        },
        {
          label: '学校',
          value: verify?.school,
          required,
        },
        {
          label: '学院',
          value: verify?.college,
          required,
        },
        {
          label: '身份证',
          value: verify?.idCard,
          required,
        },
        {
          label: '学号/工号',
          value: verify?.number,
          required,
        },
        {
          label: '姓名',
          value: verify?.name,
          required,
        },
        {
          label: '身份（用户角色）',
          value: verify?.dataRole,
        },
        {
          label: '认证材料',
          value: adminAdd ? '管理员手动添加' : verify?.attachments,
          type: adminAdd ? undefined : 'image',
          flag: adminAdd || (adminRole.value?.includes(PermissionType.VERIFICATION_CAT_ATTACHMENT) && !!verify?.attachments.length),
        },
        {
          label: '驳回理由',
          value: verify?.rejectReason,
          flag: verify?.status === VerificationStatus.REJECTED,
        },
      ]
    }
  ]
})
</script>

<template>
  <div>
    <div
      text="sm primary-1" font-400
      cursor-pointer select-none
      @click="dialog = true"
    >
      查看完整信息
    </div>

    <ZDialog
      v-model="dialog"
      title="查看完整信息"
      scroll
      :wrapperStyle="{
        width: '900px',
        maxWidth: '900px',
      }"
    >
      <div flex="~ col gap8">
        <div
          v-for="info in userInfo"
          :key="info.label"
          flex="~ col gap6"
        >
          <SubLabel :label="info.label" />
          <div flex="~ col gap6">
            <template
              v-for="item in info.list.filter(v => v.flag !== false)"
              :key="item.label"
            >
              <ReadonlyInput
                v-if="!item.type"
                :model-value="item.value"
                :label="item.label"
                :required="item.required"
                aligning
                label-position="left"
              />
              <div
                v-else-if="item.type === 'radio'"
                flex="~ items-center gap2"
              >
                <ZLabel
                  :label="item.label"
                  :required="item.required"
                  aligning w34
                />
                <div flex="~ 1 gap5" w0 relative right-2>
                  <ZRadio
                    :model-value="item.value?.toString()"
                    val="false"
                    label="正常"
                  />
                  <ZRadio
                    :model-value="item.value?.toString()"
                    val="true"
                    label="禁用"
                  />
                </div>
              </div>
              <div
                v-else-if="item.type === 'image'"
                flex="~ gap2"
              >
                <ZLabel
                  :label="item.label"
                  :required="item.required"
                  aligning w34
                />
                <div
                  v-if="userId && Array.isArray(item.value)"
                  flex="~ 1 gap2" w0
                >
                  <img
                    v-for="(img, index) in item.value"
                    v-preview:name="userId"
                    :key="index"
                    :src="getVerifyAttachmentsUrl(userId, img)"
                    w16 h16 rounded-2 cursor-pointer
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </ZDialog>
  </div>
</template>
