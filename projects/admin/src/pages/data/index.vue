<script setup lang="ts">
import DataType from '~/views/data/dataType/index.vue'
import DataStructure from '~/views/data/dataStructure/index.vue'
import DataUpload from '~/views/data/dataUpload/index.vue'
import DataIntroduce from '~/views/data/dataIntroduce/index.vue'

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
