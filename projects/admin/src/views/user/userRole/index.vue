<script lang="ts" setup>
import { PermissionType } from 'zjf-types'

import DataRole from './DataRole.vue'
import RoleAssign from './RoleAssign.vue'

const { adminRole } = useUser()

/** 菜单 */
const menu = computed(() => {
  return [
    {
      label: '用户角色设置',
      id: 'role',
      flag: adminRole.value?.includes(PermissionType.DATA_PERMISSION_QUERY),
    },
    {
      label: '用户角色分配',
      id: 'assign',
      flag: adminRole.value?.includes(PermissionType.DATA_PERMISSION_ASSIGN_QUERY),
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
    <DataRole v-if="active === 'role'" flex-1 h0 />
    <RoleAssign v-if="active === 'assign'" flex-1 h0 />
  </div>
</template>
