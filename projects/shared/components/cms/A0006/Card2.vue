<script setup lang="ts">
import { computed } from 'vue';
import type { CmsJson } from '../../../types/cms.interface'

const props = defineProps<{
  item: CmsJson
}>()

/** 颜色 */
const color = computed(() => props.item.color ? props.item.color : 'var(--primary-1)')
</script>

<template>
  <div
    class="A0006-card-item-2"
    b="1px grey-3" bg-grey-2
    :style="{
      borderTop: `2px solid ${color}`
    }"
    flex="~ gap6" p8 hover:bg-grey-1
  >
    <div
      class="icon" h12 w12 flex-center
      :style="{
        backgroundColor: color
      }" rounded-full
      v-html="item.svg"
    />
    <div flex="~ 1 col gap3" w0 h46.5>
      <h4 text-grey-8 v-text="item.title" />
      <div
        line-clamp-6 break-all text="base grey-6"
        v-text="item.richText"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.A0006-card-item-2 {
  .icon {
    :deep(svg) {
      width: 28px;
      height: 28px;
    }
  }

  &:hover {
    box-shadow: 0px 2px 12px 0px #0000001F;
  }
}
</style>
