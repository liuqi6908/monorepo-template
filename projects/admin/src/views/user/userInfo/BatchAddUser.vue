<script lang="ts" setup>
import { Notify } from 'quasar'
import { VerificationStatus, verificationStatusDescriptions } from 'zjf-types'
import { CSV_FILE_TYPE, isCsv } from 'zjf-utils'
import type { ICreateUserBodyDto } from 'zjf-types'
import {
  browser,
  ACCOUNT_REQUIREMENTS_DESC,
  EMAIL_REQUIREMENTS_DESC,
  PHONE_NUMBER_REQUIREMENTS_DESC,
  PASSWORD_REQUIREMENTS_DESC,
  validateAccount,
  validateEmail,
  validatePhone,
  validatePassword,
} from 'zjf-utils'

type CreateUserItem = Partial<Record<keyof ICreateUserBodyDto, string>>

const emits = defineEmits(['callback'])

const { isPhone } = useUser()
const { byAbsolute } = usePosition()

/** 展开菜单 */
const menu = ref(false)
/** 认证状态 */
const verifyStatus = (Object.keys(verificationStatusDescriptions) as VerificationStatus[]).map(v => ({
  key: v,
  label: verificationStatusDescriptions[v],
}))

/**
 * 下载模板
 */
function downloadTemplate() {
  const arr = [
    `账号（必填，${ACCOUNT_REQUIREMENTS_DESC}）`,
    '账号状态（选填，可选值：正常、禁用，默认值：正常）',
    `邮箱（必填，${EMAIL_REQUIREMENTS_DESC}）`,
    `密码（选填，${PASSWORD_REQUIREMENTS_DESC}）`,
    `认证状态（选填，可选值：${Object.values(verificationStatusDescriptions).join('、')}）`,
    `学校名称（选填，当 认证状态 存在时，该项必填。${SCHOOL_REQUIREMENTS_DESC}）`,
    `所在学院（选填，当 认证状态 存在时，该项必填。${COLLEGE_REQUIREMENTS_DESC}）`,
    `身份证号码（选填，当 认证状态 存在时，该项必填。${ID_CARD_REQUIREMENTS_DESC}）`,
    `学号/工号（选填，当 认证状态 存在时，该项必填。${NUMBER_REQUIREMENTS_DESC}）`,
    `姓名（选填，当 认证状态 存在时，该项必填。${NAME_REQUIREMENTS_DESC}）`,
    `驳回理由（选填，当 认证状态 为 ${verificationStatusDescriptions[VerificationStatus.REJECTED]} 时，该项必填。${REJECT_REASON_REQUIREMENTS_DESC}）`,
  ]
  if (isPhone.value)
    arr.splice(3, 0, `手机（选填，${PHONE_NUMBER_REQUIREMENTS_DESC}）`)
  browser.downloadCsv(arr.map(v => `"${v}"`).join(','), '批量添加用户')
}

/**
 * 批量添加用户
 */
async function batchAddUser(file: File) {
  if (!file)
    return

  if (!isCsv(file)) {
    Notify.create({
      color: 'danger',
      message: '只能上传 CSV 文件',
    })
    return
  }
  menu.value = false
  try {
    const content = await browser.readFile(file) as string
    const jsonArray = parseFileContent(content)

    const total = jsonArray.length
    let success = 0
    const error: Record<number, string> = {}

    const notify = Notify.create({
      type: 'loading',
      message: '正在上传中，请耐心等待...',
      caption: `上传进度：0 / ${total}`
    })
    for (let i = 0; i < total; i++) {
      try {
        const body = processingJSONData(jsonArray[i])
        await createUserApi(body, {
          headers: {
            notify: false,
          }
        })
        success++
      }
      catch (e: any) {
        const { message, detail } = e.response?.data ?? {}
        error[i + 1] =  detail?.[0]?.message ?? message ?? e.message ?? 'error'
      }
      finally {
        notify({
          caption: `上传进度：${i + 1} / ${total}`
        })
      }
    }
    showUploadResult(total, success, error, notify, () => emits('callback'))
  }
  catch (_) {
    Notify.create({
      color: 'danger',
      message: '文件内容读取失败',
    })
  }
}

/**
 * 解析 CSV 文件内容
 */
function parseFileContent(content: string) {
  const lines = content.split('\n')
  const headers: (keyof ICreateUserBodyDto)[] = [
    'account', 'isDeleted', 'email', 'password', 'status',
    'school', 'college', 'idCard', 'number', 'name', 'rejectReason',
  ]
  if (isPhone.value)
    headers.splice(3, 0, 'phone')
  const jsonArray: CreateUserItem[] = []
  for (let i = 1; i < lines.length; i++) {
    lines[i] = lines[i].trim().replace('\\r', '')
    if (lines[i]) {
      const line = lines[i].split(',').map(v => v.replace(/^"(.*)"$/, '$1').trim())
      const obj: CreateUserItem = {}
      for (let j = 0; j < headers.length; j++)
        obj[headers[j]] = line[j]
      jsonArray.push(obj)
    }
  }
  return jsonArray
}

/**
 * 处理 json 数据
 */
function processingJSONData(json: CreateUserItem): ICreateUserBodyDto {
  const {
    account = '', isDeleted, email = '', phone, password,
    school, college, idCard, number, name, rejectReason,
  } = json
  const status = verifyStatus.find(v => v.label === json.status)?.key

  if (!!validateAccount(account))
    throw new Error(validateAccount(account))
  if (!!validateEmail(email))
    throw new Error(validateEmail(email))
  if (phone && !!validatePhone(phone))
    throw new Error(validatePhone(phone))
  if (password && !!validatePassword(password))
    throw new Error(validatePassword(password))

  if (json.status) {
    if (!status)
      throw new Error(`认证状态只能为${Object.values(verificationStatusDescriptions).join('、')}`)
    if (!!validateSchool(school))
      throw new Error(validateSchool(school))
    if (!!validateCollege(college))
      throw new Error(validateCollege(college))
    if (!!validateIdCard(idCard))
      throw new Error(validateIdCard(idCard))
    if (!!validateNumber(number))
      throw new Error(validateNumber(number))
    if (!!validateName(name))
      throw new Error(validateName(name))
    if (status === VerificationStatus.REJECTED && !!validateRejectReason(rejectReason))
      throw new Error(validateRejectReason(rejectReason))
  }

  return {
    account,
    isDeleted: isDeleted === '禁用' ? true : false,
    email,
    phone: phone || undefined,
    password: password ? rsaEncrypt(import.meta.env.VITE_PUBLIC_KEY ?? '', password) : undefined,
    status,
    school: school || undefined,
    college: college || undefined,
    idCard: idCard || undefined,
    number: number || undefined,
    name: name || undefined,
    rejectReason: status === VerificationStatus.REJECTED && rejectReason || undefined,
  }
}
</script>

<template>
  <div rounded-2>
    <ZBtn
      label="批量添加用户"
      text-color="primary-1"
      :params="{
        outline: true,
      }"
    >
      <template #left>
        <div w5 h5 i-mingcute:add-line />
      </template>
      <template #icon>
        <div
          w5 h5 i-mingcute:down-line
          transition
          :style="{
            transform: menu ? 'rotate(180deg)' : 'rotate(0deg)',
          }"
        />
      </template>
    </ZBtn>
    <q-menu
      v-model="menu"
      id="batch-add-user-menu"
      class="more-menu"
      @before-show="byAbsolute('batch-add-user-menu', [0, 6])"
    >
      <q-list>
        <q-item
          clickable
          v-close-popup
          w="162px!"
          @click="downloadTemplate"
        >
          <q-item-section>
            <div i-mingcute:download-3-line />
            下载模板
          </q-item-section>
        </q-item>
        <ZUpload
          :accept="CSV_FILE_TYPE.join(',')"
          :hint-message="{
            accept: '只能上传 CSV 文件'
          }"
          @update:model-value="val => batchAddUser(val)"
        >
          <q-item
            clickable
            w="162px!"
          >
            <q-item-section>
              <div i-mingcute:upload-3-line />
              上传CSV
            </q-item-section>
          </q-item>
        </ZUpload>
      </q-list>
    </q-menu>
  </div>
</template>
