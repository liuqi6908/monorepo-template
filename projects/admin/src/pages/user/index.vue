<script setup lang="ts">
import UserInfo from '~/views/user/userInfo/index.vue'
import Verification from '~/views/user/verification/index.vue'
import UserRole from '~/views/user/userRole/index.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <UserInfo v-if="active === menu[0].id" />
    <Verification v-else-if="active === menu[1].id" />
    <UserRole v-else-if="active === menu[2].id" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
