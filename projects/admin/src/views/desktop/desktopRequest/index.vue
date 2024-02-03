<script lang="ts" setup>
import { PermissionType } from 'zjf-types'

import DesktopRequest from './DesktopRequest.vue'
import RequestConfig from './RequestConfig.vue'

const { adminRole } = useUser()

/** 菜单 */
const menu = computed(() => {
  return [
    {
      label: '云桌面申请',
      id: 'request',
      flag: adminRole.value?.includes(PermissionType.DESKTOP_REQUEST_QUERY),
    },
    {
      label: '云桌面申请上传配置',
      id: 'config',
      flag: adminRole.value?.includes(PermissionType.CONFIG_QUERY_DESKTOP_REQUEST),
    },
  ].filter(v => v.flag)
})
/** 当前激活菜单 */
const active = ref<string>()

watch(
  menu,
  (newVal) => {
    active.value = newVal[0]?.id
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div full flex="~ col gap6">
    <SubMenu v-model="active" :list="menu" />
    <DesktopRequest v-if="active === 'request'" flex-1 h0 />
    <RequestConfig v-else-if="active === 'config'" flex-1 h0 />
  </div>
</template>
