<script setup lang="ts">
import left from '~/assets/icons/ident/left.svg?raw'
import right from '~/assets/icons/ident/right.svg?raw'

const { app } = useSysConfig()
const { isExpand, isShow, time, changeState } = useSidebar()

/** 退出登录对话框 */
const dialog = ref(false)
</script>

<template>
  <!-- App Sidebar -->
  <div
    flex="~ col gap6" p="t4 b8"
    bg="#051135" text-grey-1
    :max-w="isExpand ? 80 : 20"
    :style="{
      transition: `max-width ${time}ms`
    }"
  >
    <div flex="~ col gap2">
      <!-- Title -->
      <div flex="center gap2" px4>
        <img w10.5 h10.5 :src="app?.icon" />
        <h4
          v-if="isShow"
          truncate
          v-text="app?.name"
        />
      </div>
      <!-- Unpack -->
      <div h12 flex="~ items-center">
        <div v-if="isShow" h1px flex-1 bg-white-2 />
        <div
          class="unpack"
          :mx="isShow ? 4 : 'auto'"
          cursor-pointer
          v-html="isExpand ? left : right"
          @click="changeState"
        />
      </div>
    </div>
    <div flex="~ 1 col gap6" px4 h0>
      <HomeMenu flex-1 h0 class="hide-scrollbar" />
      <MenuItem
        label="退出登录"
        icon="exit"
        @click="dialog = true"
      />
    </div>

    <!-- 退出登录对话框 -->
    <LogoutDialog v-model="dialog" />
  </div>
</template>
