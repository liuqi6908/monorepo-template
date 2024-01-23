<script lang="ts" setup>
import type { CmsJson } from '../../types/cms.interface'

defineProps<{
  list?: CmsJson[]
}>()
</script>

<template>
  <div
    v-if="list?.length"
    class="A0006"
    w-limited-1
    v-html="list[0].richText"
  />
</template>
