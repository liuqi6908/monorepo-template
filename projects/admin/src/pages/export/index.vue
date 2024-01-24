<script setup lang="ts">
import LargeFileAudit from '~/views/export/LargeFileAudit.vue'
import LargeFileRecord from '~/views/export/LargeFileRecord.vue'
import SmallFileRecord from '~/views/export/SmallFileRecord.vue'
import ExportConfig from '~/views/export/ExportConfig.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <LargeFileAudit v-if="active === menu[0].id" />
    <LargeFileRecord v-else-if="active === menu[1].id" />
    <SmallFileRecord v-else-if="active === menu[2].id" />
    <ExportConfig v-else-if="active === menu[3].id" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
