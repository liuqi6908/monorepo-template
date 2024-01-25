<script setup lang="ts">
import DataType from '~/views/data/DataType.vue'
import DataStructure from '~/views/data/DataStructure.vue'
import DataUpload from '~/views/data/DataUpload.vue'
import DataIntroduce from '~/views/data/DataIntroduce.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <DataType v-if="active === menu[0].id" />
    <DataStructure v-else-if="active === menu[1].id" />
    <DataUpload v-else-if="active === menu[2].id" />
    <DataIntroduce v-else-if="active === menu[3].id" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
