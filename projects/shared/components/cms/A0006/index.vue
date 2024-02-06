<script setup lang="ts">
import { computed } from 'vue'
import type { CmsJson } from '../../../types/cms.interface'
import icon from '../../../assets/icons/chat.svg?raw'
import Card from './Card.vue'

interface CmsItem extends CmsJson {
  to?: any
}

const props = defineProps<{
  list?: CmsItem[]
}>()

/** 处理之后的数据 */
const disposeData = computed(() => props.list?.map((item) => ({
  ...item,
  svg: fillReplacedSvg(item.svg),
  richText: htmlDecodeByRegExp(item.richText),
})))

/**
 * 将 HTML 字符串进行解码
 */
function htmlDecodeByRegExp(htmlStr?: string) {
  return htmlStr?.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '')
    .replace(/<[^>]+?>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ /g, ' ')
    .replace(/&ldquo;/g, ' ')
    .replace(/&rdquo;/g, ' ')
    .replace(/&nbsp;/ig, '')
    .replace(/>/g, ' ')
}

/**
 * 替换svg的fill和stroke属性
 */
function fillReplacedSvg(htmlStr?: string){
  return htmlStr?.replace(/fill=".*?"/g, 'fill="currentColor"')
    .replace(/stroke=".*?"/g, 'stroke="currentColor"') || icon
}
</script>

<template>
  <div
    class="A0006"
    w-limited-1 flex="~ row wrap"
    gap="y10 x20"
  >
    <template v-for="item in disposeData">
      <RouterLink
        v-if="item.to"
        :to="item.to"
        flex-1 min-w-112
      >
        <Card :item="item" />
      </RouterLink>
      <div v-else flex-1 min-w-112>
        <Card :item="item" />
      </div>
    </template>
  </div>
</template>
