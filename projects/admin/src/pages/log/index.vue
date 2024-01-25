<script setup lang="ts">
import LogView from '~/views/log/LogView.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <LogView v-if="active === menu[0].id" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
