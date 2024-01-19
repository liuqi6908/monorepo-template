<script setup lang="ts">
import { PermissionType } from 'zjf-types'
import { omit } from 'zjf-utils'

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
    {{ value }}
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
