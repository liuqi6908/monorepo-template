<script setup lang="ts">
import DesktopRequest from '~/views/desktop/desktopRequest/index.vue'
import QueueingList from '~/views/desktop/queueingList/index.vue'
import DesktopList from '~/views/desktop/desktopList/index.vue'
import DesktopRecycled from '~/views/desktop/desktopRecycled/index.vue'
import UserDataUpload from '~/views/desktop/userDataUpload/index.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <DesktopRequest v-if="active === menu[0].id" />
    <QueueingList v-else-if="active === menu[1].id" />
    <DesktopList v-else-if="active === menu[2].id" />
    <DesktopRecycled v-else-if="active === menu[3].id" />
    <UserDataUpload v-else-if="active === menu[4].id" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
