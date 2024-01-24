<script setup lang="ts">
import CmsManage from '~/views/home/cmsManage/index.vue'
import GlobalConfig from '~/views/home/globalConfig/index.vue'

const { pageConfig } = useEditCms()
const { active } = useMenu()
</script>

<template>
  <div bg-grey-2>
    <CmsManage v-if="pageConfig" :key="active" full />
    <GlobalConfig v-else full />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
