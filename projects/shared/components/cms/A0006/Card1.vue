<script setup lang="ts">
import type { CmsJson } from '../../../types/cms.interface'

defineProps<{
  item: CmsJson
}>()
</script>

<template>
  <div class="A0006-card-item-1" flex="~ col items-center gap3" p="y6 x10">
    <div
      class="icon" h12 w12 flex-center
      bg="primary-1/8" text-primary-1 rounded-full
      v-html="item.svg"
    />
    <h4 text="grey-8 center" v-text="item.title" />
    <div
      line-clamp-6 break-all text="base grey-6"
      v-text="item.richText"
    />
  </div>
</template>

<style lang="scss" scoped>
.A0006-card-item-1 {
  .icon {
    :deep(svg) {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
