<script setup lang="ts">
import CmsManage from '~/views/home/cmsManage/index.vue'
import GlobalConfig from '~/views/home/globalConfig/index.vue'

const { page, pageConfig } = useEditCms()
const { active } = useMenu()

watch(
  active,
  (newVal) => {
    page.value = newVal
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div bg-grey-2>
    <CmsManage v-if="pageConfig" :key="page" full />
    <GlobalConfig v-else full />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
