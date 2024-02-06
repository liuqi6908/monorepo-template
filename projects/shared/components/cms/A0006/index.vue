<script setup lang="ts">
import { computed } from 'vue'
import type { CmsJson } from '../../../types/cms.interface'
import icon from '../../../assets/icons/chat.svg?raw'
import Card1 from './Card1.vue'
import Card2 from './Card2.vue'

interface CmsItem extends CmsJson {
  to?: any
}

const props = defineProps<{
  list?: CmsItem[]
}>()

/** 卡片样式 */
const cardStyle = computed(() => props.list?.[0].style)

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
  const color = cardStyle.value === '2' ? 'white' : 'currentColor'
  return (htmlStr || icon).replace(/fill=".*?"/g, `fill="${color}"`)
    .replace(/stroke=".*?"/g, `stroke="${color}"`)
}
</script>

<template>
  <div
    class="A0006"
    w-limited-1 flex="~ row wrap"
    gap-y10 :gap-x="cardStyle === '2' ? 10 : 20"
  >
    <template v-for="item in disposeData">
      <RouterLink
        v-if="item.to"
        :to="item.to"
        flex-1 min-w-112
      >
        <Card1 v-if="!cardStyle || cardStyle === '1'" :item="item" />
        <Card2 v-else-if="cardStyle === '2'" :item="item" />
      </RouterLink>
      <div v-else flex-1 min-w-112>
        <Card1 v-if="!cardStyle || cardStyle === '1'" :item="item" />
        <Card2 v-else-if="cardStyle === '2'" :item="item" />
      </div>
    </template>
  </div>
</template>
