<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useElementSize, isClient } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import ZMenu from '../menu/ZMenu.vue'
import type { CmsJson } from '../../types/cms.interface'
import { RichTextProcessor } from '../../utils/richText'
import { useSysConfig } from '../../composables/app'

const props = defineProps<{
  list?: CmsJson[]
}>()

/** 目录元素 */
const toc = ref<HTMLElement>()

const { width, height } = useElementSize(toc)
const value = useRouteQuery<number | undefined>('index', undefined, { transform: Number })
const { isAdmin } = useSysConfig()
let type = false

/** 粘性定位 */
const top = ref(0)

/** 目录 */
const tocList = computed(() => {
  return props.list?.map(({ title, richText }, index) => {
    return {
      id: index,
      label: title ?? '',
      richText: RichTextProcessor.from(richText ?? '').lazyLoadImages().html,
    }
  })
})

onMounted(() => {
  nextTick(() => {
    if (!isClient)
      return
    const appHeader = document.querySelector('.app-header')
    if (!isAdmin.value && appHeader)
      top.value = appHeader.clientHeight
    else if (isAdmin.value)
      top.value = 0
    if (typeof value.value === 'number')
      scroll(value.value)
  })
})

/** 激活目录，滚动 */
function scroll(id?: number) {
  value.value = id
  if (typeof id !== 'number' || !isClient)
    return

  type = true
  setTimeout(() => {
    const dom = document.querySelector(`#question_${id}`)
    if (!dom)
      return
    dom.scrollIntoView({
      behavior: 'smooth',
    })
    type = false
  }, 110)
}
</script>

<template>
  <div
    class="A0003"
    w-limited-1 p="t10 b20"
    flex="~ gap2" sm="gap4" lg="gap6"
    xl="gap8"
  >
    <!-- Toc -->
    <div>
      <q-scroll-area
        sticky
        :style="{
          maxHeight: 'calc(100vh - 144px)',
          height: `${height}px`,
          width: `${width + 1}px`,
          top: `${top + 3}px`
        }"
      >
        <ZMenu
          ref="toc"
          :model-value="value"
          :list="tocList"
          @update:model-value="val => scroll(val)"
        />
      </q-scroll-area>
    </div>
    <!-- Content -->
    <div flex="~ 1 col gap10" w0 pb10>
      <template v-for="(item, index) in tocList" :key="index">
        <div flex="~ col">
          <div
            :id="`question_${index}`" relative
            :style="{ top: `-${top}px` }"
          />
          <q-item
            clickable flex="~ items-center gap-2"
            p2 min-h-auto sticky bg-grey-1 z-1
            :style="{ top: `${top}px` }"
            @click="() => {
              if (value === index)
                value = undefined
              else
                value = index
            }"
          >
            <div
              :style="{ transform: value === index ? 'rotate(0deg)' : 'rotate(-90deg)' }"
              w6 h6 transition-all flex-center
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15L7 10H17L12 15Z" fill="black"/>
              </svg>
            </div>
            <h4 truncate v-text="item.label" />
          </q-item>
          <q-expansion-item
            :model-value="value === index"
            header-class="display-none"
            :duration="type ? 0 : 300"
          >
            <div pl14 py2 relative>
              <div
                absolute top-3 bottom-3 left-10
                w2px bg="primary-1/70"
              />
              <div
                class="richtext-content"
                text="base grey-6" font-400
                overflow-hidden
                v-html="item.richText"
              />
            </div>
          </q-expansion-item>
        </div>
        <div
          v-if="list?.length && index < list.length - 1"
          h1px bg-grey-3 m-auto
          style="width: calc(100% - 16px)"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-scrollarea {
  :deep(.q-scrollarea__content) {
    display: flex;
  }
}
</style>