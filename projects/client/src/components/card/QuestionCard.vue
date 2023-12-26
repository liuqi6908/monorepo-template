<script lang="ts" setup>
import icon from '~/assets/icons/chat.svg?raw'

interface Props {
  title?: string
  svg?: string
  richText?: string
}

const props = defineProps<Props>()

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
const fillReplacedSvg = computed(() => {
  return props.svg?.replace(/fill=".*?"/g, 'fill="currentColor"')
    .replace(/stroke=".*?"/g, 'stroke="currentColor"') || icon
})
</script>

<template>
  <div class="question-card" flex="~ col items-center gap3" p="y6 x10">
    <div
      class="icon" h12 w12 flex-center
      bg="primary-1/8" text-primary-1 rounded-full
      v-html="fillReplacedSvg"
    />
    <h4 text="grey-8 center" v-text="title" />
    <div
      line-clamp-6 break-all text="base grey-6"
      v-text="htmlDecodeByRegExp(richText)"
    />
  </div>
</template>

<style lang="scss" scoped>
.question-card {
  .icon {
    :deep(svg) {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
