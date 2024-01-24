<script setup lang="ts">
import CmsManage from '~/views/home/cmsManage/index.vue'
import GlobalConfig from '~/views/home/globalConfig/index.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length" bg-grey-2>
    <CmsManage v-if="active !== menu[CMS_CONFIG.length].id" :key="active" full />
    <GlobalConfig v-else full />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
