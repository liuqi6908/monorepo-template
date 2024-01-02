<script setup lang="ts">
const { app } = useSysConfig()
</script>

<template>
  <!-- App Header -->
  <div bg-grey-1 p="t6 b4" text-primary-1>
    <div w-limited-1 flex="~ col gap3">
      <!-- Title And User -->
      <div flex="~ justify-between">
        <div flex="~ gap2 items-center">
          <img w10 h10 :src="app?.icon" />
          <h3 v-text="app?.name" />
          <div w3px h8 bg-primary-1 />
          <div text-lg v-text="'CloudResearch'" />
        </div>
        <Avatar />
      </div>
      <!-- Menu -->
      <HomeMenu />
    </div>
  </div>
</template>
