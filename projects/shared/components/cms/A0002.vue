<script lang="ts" setup>
import { computed } from 'vue'
import type { CmsJson } from '../../types/cms.interface'

const props = defineProps<{
  list?: CmsJson[]
}>()

const item = computed(() => props.list?.[0])
</script>

<template>
  <div v-if="item" class="A0002" text-grey-8>
    <div
      v-if="!item.style || item.style === '1'"
      class="A0002-style-1"
      w-limited-1 flex="center gap10 wrap" xl="gap25"
    >
      <q-img h77 w109 :src="item.img || 'error'" fit="fill">
        <template #error>
          <img full src="../../assets/imgs/introduce.webp" />
        </template>
      </q-img>
      <div flex="~ 1 col items-center gap6" min-w-125>
        <h1 text-center v-text="item.title" />
        <div
          v-if="item.richText"
          text-lg font-400
          v-html="item.richText"
        />
      </div>
    </div>
    <div
      v-else-if="item.style === '2'"
      class="A0002-style-2"
      w-limited-1 flex="center col gap12"
      lg="flex-row gap0" xl="gap12"
    >
      <div h90 w96 relative lg="h72 w76" xl="h90 w96" z-1>
        <div
          absolute hidden lg="block"
          top="-3" bottom="-3" right="-12"
          w="200vw" bg-grey-1
          style="box-shadow: 0px 4px 16px 8px #00000014"
        />
        <q-img full :src="item.img || 'error'" fit="fill">
          <template #error>
            <img full src="../../assets/imgs/introduce.webp" />
          </template>
        </q-img>
      </div>
      <div relative flex="~ 1 col gap8" p="y20 x10" lg="py29 pl20">
        <div
          absolute top-0 bottom-0
          left="-26.5" lg="left--14.5" xl="left--26.5"
          w="200vw" bg-grey-2
        />
        <div flex="~ col gap4" z-1>
          <div h2 w16 bg-primary-1 />
          <h1 v-text="item.title" />
        </div>
        <div
          v-if="item.richText"
          text-lg font-400 z-1
          v-html="item.richText"
        />
      </div>
    </div>
  </div>
</template>
