<script setup lang="ts">
import { Notify } from 'quasar'
import { validatePassword } from 'zjf-utils'

defineProps<{ layout?: boolean }>()

const $route = useRoute()
const { userInfo, getOwnProfile, isLogin } = useUser()

/** 修改密码对话框 */
const dialog = ref(false)
/** 密码 */
const password = ref('')
/** 确认密码 */
const repeatPassword = ref('')

/** 禁用修改密码 */
const disable = computed(() => !!validatePassword(password.value) || password.value !== repeatPassword.value)

onMounted(async () => {
  if (isLogin.value) {
    await getOwnProfile()
    if ($route.name === 'home' && !userInfo.value?.password)
      dialog.value = true
  }
})

/**
 * 修改密码
 */
async function changePassword() {
  if (disable.value)
    return

  const res = await updateOwnPasswordByOldPasswordApi({
    newPassword: password.value,
  })
  if (res) {
    Notify.create({
      message: '修改成功',
      type: 'success',
    })
  }
}
</script>

<template>
  <div>
    <AppHeader sticky top-0 z-99 />

    <div min-h-100>
      <slot v-if="layout" />
      <RouterView v-else />
    </div>

    <AppFooter />

    <ZDialog
      v-model="dialog"
      title="设置密码"
      footer
      :disable-confirm="disable"
      @ok="changePassword"
    >
      <div text-sm mb5>
        欢迎您登录本平台，由于您登录的账号密码不存在，为了您的账号安全，请在下方设置默认密码，以便后续使用！
      </div>
      <ZInput
        v-model="password"
        label="密码"
        placeholder="请输入密码"
        password mb1
        :params="{
          rules: [
            (val: string) => validatePassword(val) || true
          ]
        }"
      />
      <ZInput
        v-model="repeatPassword"
        label="确认密码"
        placeholder="请确认密码"
        password
        :params="{
          rules: [
            (val: string) => val === password || '两次密码不一致'
          ],
          reactiveRules: true
        }"
      />
    </ZDialog>
  </div>
</template>
