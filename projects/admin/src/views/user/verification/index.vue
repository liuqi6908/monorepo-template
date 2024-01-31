<script lang="ts" setup>
import { PermissionType } from 'zjf-types'

import Verification from './Verification.vue'
import VerifyConfig from './VerifyConfig.vue'

const { adminRole } = useUser()

/** 菜单 */
const menu = computed(() => {
  return [
    {
      label: '用户认证',
      id: 'verify',
      flag: adminRole.value?.includes(PermissionType.VERIFICATION_LIST_ALL),
    },
    {
      label: '用户认证上传配置',
      id: 'config',
      flag: adminRole.value?.includes(PermissionType.CONFIG_QUERY_VERIFICATION),
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
    <Verification v-if="active === 'verify'" flex-1 h0 />
    <VerifyConfig v-if="active === 'config'" flex-1 h0 />
  </div>
</template>
