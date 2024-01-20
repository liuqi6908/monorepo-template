<script setup lang="ts">
import { PermissionType } from 'zjf-types'
import { omit } from 'zjf-utils'

import CmsManage from '~/views/home/CmsManage.vue'
import GlobalConfig from '~/views/home/GlobalConfig.vue'

const { adminRole } = useUser()

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
const value = ref<string>()

watch(
  menu,
  (newVal) => {
    if (newVal.length && !newVal.find(v => v.id === value.value))
      value.value = newVal[0].id
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div flex="~ col">
    <SubMenu v-model="value" :list="menu" />
    <CmsManage
      v-if="CMS_CONFIG.find(v => v.id === value)"
      :key="value"
      :config="CMS_CONFIG.find(v => v.id === value)!"
    />
    <GlobalConfig v-else />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
