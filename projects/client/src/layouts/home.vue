<script setup lang="ts">
import SetPasswordDialog from '~/views/userCenter/authentication/SetPassword.dialog.vue'

defineProps<{ layout?: boolean }>()

const $route = useRoute()
const { userInfo, getOwnProfile, isLogin } = useUser()

/** 设置密码对话框 */
const dialog = ref(false)

onMounted(async () => {
  if (isLogin.value) {
    await getOwnProfile()
    if ($route.name === 'home' && !userInfo.value?.password)
      dialog.value = true
  }
})
</script>

<template>
  <div>
    <AppHeader sticky top-0 z-99 />

    <div min-h-100>
      <slot v-if="layout" />
      <RouterView v-else />
    </div>

    <AppFooter />

    <SetPasswordDialog v-model="dialog">
      <div text-sm mb4>
        欢迎您登录本平台，由于您登录的账号密码不存在，为了您的账号安全，请在下方设置默认密码，以便后续使用！
      </div>
    </SetPasswordDialog>
  </div>
</template>
