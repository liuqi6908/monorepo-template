<script lang="ts" setup>
import type { CmsJson } from '../../../types/cms.interface'

defineProps<{
  list?: CmsJson[]
}>()
</script>

<template>
  <div v-if="list?.length" pb-20 flex="~ col gap6">
    <div
      v-for="(item, index) in list.filter(v => v.richText)"
      :key="index" w-auto w-limited-1
      text="base grey-8" font-400
      v-html="item.richText"
    />
  </div>
</template>
