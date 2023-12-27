<script setup lang="ts">
import user from '~/assets/icons/user.svg?raw'

const { userInfo, isLogin, logout } = useUser()
const { width } = useWindowSize()

/** 用户名的首个字符 */
const firstCharName = computed(() => {
  const name = getUsername(userInfo.value)
  return name ? name.substring(0, 1) : ''
})

/** 退出登录对话框 */
const dialog = ref(false)
</script>

<template>
  <div cursor-pointer select-none flex="~ items-center">
    <!-- 登录 -->
    <template v-if="isLogin">
      <div
        w10 h10 flex-center
        b="1.5px primary-1" rounded-full
      >
        <h4 v-if="firstCharName" v-text="firstCharName" />
        <div v-else v-html="user" />
      </div>
      <q-menu
        class="avatar-menu"
        anchor="bottom right"
        self="top right"
        :offset="[
          width >= APP_MIN_WIDTH ? 0 : 570 - (570 / APP_MIN_WIDTH) * width,
          width >= APP_MIN_WIDTH ? 16 : 82 - (66 / APP_MIN_WIDTH) * width,
        ]"
        style="box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);"
        w50 py2 rounded-0
      >
        <q-list>
          <q-item
            v-for="(item, index) in USER_MENU_LIST"
            :key="index"
            v-close-popup
            clickable
            :to="item.to"
            @click="() => {
              if (!item.to)
                dialog = true
            }"
          >
            <q-item-section>
              {{ item.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </template>
    <!-- 未登录 -->
    <RouterLink
      v-else
      flex="~ row gap2 items-center"
      :to="{
        path: '/auth/login'
      }"
    >
      <div
        w10 h10 flex-center
        b="1.5px primary-1" rounded-full
      >
        <div v-html="user" />
      </div>
      <div font-500 v-text="'登录'" />
    </RouterLink>

    <!-- 退出登录对话框 -->
    <ZDialog
      v-model="dialog"
      title="退出登录"
      confirm-text="退出"
      footer
      :wrapperStyle="{
        width: '488px'
      }"
      @ok="logout"
    >
      是否退出登录？
    </ZDialog>
  </div>
</template>

<style lang="scss">
.avatar-menu {
  .q-item {
    &:hover > .q-focus-helper {
      opacity: 0.08 !important;
    }
  }
}
</style>
