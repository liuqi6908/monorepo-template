<script setup lang="ts">
import { PermissionType } from 'zjf-types'
import { omit } from 'zjf-utils'

import CmsManage from '~/views/home/cmsManage/index.vue'
import GlobalConfig from '~/views/home/globalConfig/index.vue'

const { adminRole } = useUser()
const { page, pageConfig } = useEditCms()

/** 菜单导航 */
const menu = computed(() => {
  const menu = CMS_CONFIG.filter(({ label }) => (
    adminRole.value?.includes(PermissionType.CMS_QUERY)
    && (label !== '首页拓展' || getEnvVariable('VITE_HOME_EXPAND'))
  )).map(v => omit(v, 'component'))
  if (adminRole.value?.includes(PermissionType.CONFIG_QUERY_APP))
    menu.push({ id: 'config', label: '全局配置' })
  return menu
})

watch(
  menu,
  (newVal) => {
    if (newVal.length && !newVal.find(v => v.id === page.value))
      page.value = newVal[0].id
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div flex="~ col">
    <SubMenu v-model="page" :list="menu" />
    <CmsManage
      v-if="pageConfig"
      :key="page"
    />
    <GlobalConfig v-else />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
