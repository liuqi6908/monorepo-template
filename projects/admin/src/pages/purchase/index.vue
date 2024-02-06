<script setup lang="ts">
import PurchaseView from '~/views/purchase/PurchaseView.vue'
import PurchaseConfig from '~/views/purchase/PurchaseConfig.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <PurchaseView v-if="active === menu[0].id" />
    <PurchaseConfig v-else-if="active === menu[1].id" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
