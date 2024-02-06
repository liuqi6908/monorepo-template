<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import type { CmsJson } from '../../types/cms.interface'

const props = defineProps<{
  list?: CmsJson[]
}>()

const flexBox = ref<HTMLElement>()
const linefeed = ref(false)

/** 背景色 */
const bgColor = computed(() => props.list?.[0]?.color || '#001020')

useResizeObserver(flexBox, ([{ contentRect, target }]) => {
  const { width } = contentRect
  const { children } = target
  let allWidth = Math.floor(children.length / 2)  * 49.5
  for (let i = 0; i < children.length; i++) {
    const { className, clientWidth } = children[i]
    if (!className)
      allWidth += clientWidth
  }
  linefeed.value = width < allWidth
})
</script>

<template>
  <div
    class="A0004"
    text-grey-1 py36
    :style="{
      backgroundColor: bgColor
    }"
  >
    <div
      v-if="list?.length"
      ref="flexBox"
      w-limited-1
      :flex="`~ justify-between items-start gap6 wrap ${linefeed ? 'col' : 'row'}`"
    >
      <template
        v-for="(item, index) in list"
        :key="index"
      >
        <div flex="~ col gap8">
          <div text-lg font-500 v-text="item.title" />
          <div v-if="item.richText" text-sm font-400 v-html="item.richText"/>
        </div>
        <div
          v-if="index < list.length - 1"
          :class="`line-${linefeed ? 'horizontal' : 'vertical'}`"
          bg-white-3
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.A0004 {
  img {
    display: inline;
  }

  .line {
    &-vertical {
      height: 65px;
      width: 1px;
      margin: auto 0;
    }

    &-horizontal {
      height: 1px;
      width: 100px;
    }
  }
}
</style>