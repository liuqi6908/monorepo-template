<script setup lang="ts">
import PurchaseView from '~/views/purchase/PurchaseView.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <PurchaseView v-if="active === menu[0].id" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
