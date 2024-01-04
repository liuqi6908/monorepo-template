<script lang="ts" setup>
import type { CmsJson } from '../../../types/cms.interface'

defineProps<{
  list?: CmsJson[]
}>()
</script>

<template>
  <div v-if="list?.length" flex="~ col gap6">
    <div
      v-for="(item, index) in list.filter(v => v.richText)"
      :key="index"
      text="base grey-8" font-400
      v-html="item.richText"
    />
  </div>
</template>
