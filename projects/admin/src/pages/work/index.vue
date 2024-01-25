<script setup lang="ts">
import WorkView from '~/views/work/WorkView.vue'
import WorkConfig from '~/views/work/WorkConfig.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <WorkView v-if="active === menu[0].id" />
    <WorkConfig v-else-if="active === menu[1].id" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
