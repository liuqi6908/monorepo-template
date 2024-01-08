<script setup lang="ts">
const appHeader = ref<HTMLElement>()

const { app } = useSysConfig()

onMounted(() => {
  nextTick(() => useAppHeader(appHeader.value))
})
</script>

<template>
  <!-- App Header -->
  <div ref="appHeader" class="app-header" bg-grey-1 p="t6 b4" text-primary-1>
    <div w-limited-1 flex="~ col gap3">
      <!-- Title And User -->
      <div flex="~ justify-between items-center gap2">
        <div flex="~ 1 gap2 items-center" w0 whitespace-nowrap overflow-hidden>
          <img w10 h10 :src="app?.icon" />
          <h3 v-text="app?.name" />
          <template v-if="app?.nameEn">
            <div min-w-3px h8 bg-primary-1 />
            <div text-lg v-text="app.nameEn" />
          </template>
        </div>
        <Avatar />
      </div>
      <!-- Menu -->
      <HomeMenu />
    </div>
  </div>
</template>
