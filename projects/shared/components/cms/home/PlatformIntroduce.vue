<script lang="ts" setup>
import type { CmsJson } from '../../../types/cms.interface'

defineProps<{
  list?: CmsJson[]
}>()
</script>

<template>
  <div bg-grey-1 py20 text-grey-8>
    <div w-limited-1 flex="center gap10 wrap" xl="gap25">
      <img h77 w109 src="../../../assets/imgs/introduce.webp" />
      <div v-if="list?.length" flex="~ 1 col items-center gap6" min-w-125>
        <h1 text-center v-text="list[0].title" />
        <div
          v-if="list[0].richText"
          text-lg font-400
          v-html="list[0].richText"
        />
      </div>
    </div>
  </div>
</template>
