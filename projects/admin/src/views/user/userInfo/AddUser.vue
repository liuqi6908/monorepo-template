<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import { validateAccount, validateEmail, validatePassword, validatePhone } from 'zjf-utils'
import { VerificationStatus, verificationStatusDescriptions } from 'zjf-types'
import type { ICreateUserBodyDto } from 'zjf-types'

interface AddForm extends ICreateUserBodyDto {
  repeatPassword?: ICreateUserBodyDto['password']
}

const emits = defineEmits(['callback'])

const { isPhone } = useUser()

/** 对话框 */
const dialog = ref(false)
/** 初始数据 */
const initData: ICreateUserBodyDto = {
  account: '',
  email: '',
  isDeleted: false,
}
/** 添加用户 form 表单 */
const form = ref<AddForm>(cloneDeep(initData))

/** 禁用提交 */
const disable = computed<boolean>(() => {
  const {
    account, email, phone, password, repeatPassword,
    status, school, college, idCard, number, name, rejectReason,
  } = form.value
  return !!validateAccount(account)
    || !!validateEmail(email)
    || (!!phone && !!validatePhone(phone))
    || (!!password && (!!validatePassword(password) || password !== repeatPassword))
    || (!!status && (
      !!validateSchool(school)
      || !!validateCollege(college)
      || !!validateIdCard(idCard)
      || !!validateNumber(number)
      || !!validateName(name)
      || (status === VerificationStatus.REJECTED && !!validateRejectReason(rejectReason))
    ))
})

/**
 * 初始化数据
 */
function init() {
  form.value = cloneDeep(initData)
}

/**
 * 创建用户
 */
async function createUser() {
  if (disable.value)
    return

  const body = cloneDeep(form.value)
  const { phone, password, } = body
  delete body.repeatPassword
  body.password = password ? rsaEncrypt(password) : undefined
  body.phone = phone ? phone : undefined
  const res = await createUserApi(body)
  if (res) {
    Notify.create({
      type: 'success',
      message: '添加成功',
    })
    emits('callback')
    init()
  }
}
</script>

<template>
  <div>
    <ZBtn
      label="添加用户"
      @click="dialog = true"
    >
      <template #left>
        <div w5 h5 i-mingcute:add-line />
      </template>
    </ZBtn>

    <ZDialog
      v-model="dialog"
      title="添加用户"
      scroll footer
      confirm-text="保存"
      :wrapperStyle="{
        width: '900px',
        maxWidth: '900px',
      }"
      :disable-confirm="disable"
      @ok="createUser"
    >
      <div flex="~ col gap8">
        <div flex="~ col gap6">
          <SubLabel label="基本信息" />
          <div flex="~ col gap1">
            <ZInput
              v-model="form.account"
              label="用户名"
              placeholder="请输入用户名"
              label-position="left"
              required
              :params="{
                rules: [
                  (val: string) => validateAccount(val) || true
                ]
              }"
            />
            <div flex="~ items-center gap2" mb5>
              <ZLabel
                label="账号状态"
                aligning w34
              />
              <div flex="~ 1 gap5" w0 relative right-2>
                <ZRadio
                  :model-value="form.isDeleted?.toString()"
                  val="false"
                  label="正常"
                  @update:model-value="form.isDeleted = false"
                />
                <ZRadio
                  :model-value="form.isDeleted?.toString()"
                  val="true"
                  label="禁用"
                  @update:model-value="form.isDeleted = true"
                />
              </div>
            </div>
            <ZInput
              v-model="form.email"
              label="邮箱"
              placeholder="请输入邮箱"
              label-position="left"
              required
              :params="{
                rules: [
                  (val: string) => validateEmail(val) || true
                ]
              }"
            />
            <ZInput
              v-if="isPhone"
              v-model="form.phone"
              label="手机"
              placeholder="请输入手机号"
              label-position="left"
              aligning
              :params="{
                rules: [
                  (val: string) => !val || validatePhone(val) || true
                ]
              }"
            />
            <ZInput
              v-model="form.password"
              label="密码"
              placeholder="请输入密码"
              label-position="left"
              aligning password
              :params="{
                rules: [
                  (val: string) => !val || validatePassword(val) || true
                ]
              }"
            />
            <ZInput
              v-model="form.repeatPassword"
              label="确认密码"
              placeholder="请确认密码"
              label-position="left"
              :required="!!form.password"
              aligning password
              :params="{
                rules: [
                  (val: string) => (!form.password && !val) || val === form.password || '两次密码不一致'
                ],
                reactiveRules: true
              }"
            />
          </div>
        </div>
        <div flex="~ col gap6">
          <SubLabel label="认证信息" />
          <div flex="~ col gap5">
            <ZSelect
              :model-value="form.status ? verificationStatusDescriptions[form.status] : ''"
              :options="Object.keys(verificationStatusDescriptions).map(v => ({
                label: verificationStatusDescriptions[v as VerificationStatus],
                value: v,
              }))"
              label="认证状态"
              placeholder="请选择认证状态"
              label-position="left"
              aligning
              :params="{
                clearable: true,
              }"
              @update:model-value="val => {
                if (val)
                  form.status = val.value
                else
                  form.status = undefined
              }"
            />
            <div flex="~ col gap1" :class="{ 'disable-container': !form.status }">
              <ZInput
                v-model="form.school"
                label="学校名称"
                placeholder="请输入学校名称"
                label-position="left"
                aligning
                :required="!!form.status"
                :params="{
                  rules: [
                    (val: string) => !form.status || validateSchool(val) || true
                  ],
                  reactiveRules: true
                }"
              />
              <ZInput
                v-model="form.college"
                label="所在学院"
                placeholder="请输入学院名称"
                label-position="left"
                aligning
                :required="!!form.status"
                :params="{
                  rules: [
                    (val: string) => !form.status || validateCollege(val) || true
                  ],
                  reactiveRules: true
                }"
              />
              <ZInput
                v-model="form.idCard"
                label="身份证号码"
                placeholder="请输入身份证号码"
                label-position="left"
                aligning
                :required="!!form.status"
                :params="{
                  rules: [
                    (val: string) => !form.status || validateIdCard(val) || true
                  ],
                  reactiveRules: true
                }"
              />
              <ZInput
                v-model="form.number"
                label="学号/工号"
                placeholder="请输入学号/工号"
                label-position="left"
                aligning
                :required="!!form.status"
                :params="{
                  rules: [
                    (val: string) => !form.status || validateNumber(val) || true
                  ],
                  reactiveRules: true
                }"
              />
              <ZInput
                v-model="form.name"
                label="姓名"
                placeholder="请输入真实姓名"
                label-position="left"
                aligning
                :required="!!form.status"
                :params="{
                  rules: [
                    (val: string) => !form.status || validateName(val) || true
                  ],
                  reactiveRules: true
                }"
              />
              <ZInput
                v-if="form.status === VerificationStatus.REJECTED"
                v-model="form.rejectReason"
                label="驳回理由"
                placeholder="请输入驳回理由"
                label-position="left"
                aligning
                :required="form.status === VerificationStatus.REJECTED"
                :params="{
                  rules: [
                    (val: string) => form.status !== VerificationStatus.REJECTED || validateRejectReason(val) || true
                  ],
                  reactiveRules: true
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </ZDialog>
  </div>
</template>

<style lang="scss" scoped>
.disable-container {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 999;
    cursor: not-allowed;
    background-color: var(--white-3);
  }
}
</style>
