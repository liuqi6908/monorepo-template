<script lang="ts" setup>
import * as mammoth from 'mammoth'
import { ref, onBeforeMount, onMounted, nextTick, watch, computed } from 'vue'
import { isClient, useElementSize, useScroll } from '@vueuse/core'
import type { QScrollArea } from 'quasar'

import ZLoading from '../../../components/loading/ZLoading.vue'
import ZMenu from '../../../components/menu/ZMenu.vue'
import Empty from '../Empty.vue'
import { getDbIntroApi } from '../../../api/file'
import { useSysConfig } from '../../../composables/app'

interface Props {
  rootId: string
  nameEn: string
  el?: InstanceType<typeof QScrollArea>
  scrollTo?: (offset: number, axis?: "vertical" | "horizontal", duration?: number | undefined) => void
  top?: number
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  top: 0,
})

/** 目录元素 */
const toc = ref<HTMLElement>()

const { width, height } = useElementSize(toc)
const { isAdmin } = useSysConfig()

/** 加载中 */
const loading = ref(false)
/** 文档 */
const docHtml = ref<{
  toc: {
    id: string
    label: string
  }[]
  article: HTMLElement
}>()
/** 当前激活目录 */
const value = ref<string>()

/** 滚动高度 */
const scrollTop = computed(() => {
  if (isAdmin.value)
    return props.top
  else
    return props.top - 41
})

onBeforeMount(async () => {
  const { rootId, nameEn } = props
  loading.value = true
  try {
    const res = await getDbIntroApi(rootId, `${nameEn}.docx`)
    await parseDocFile(res)
  }
  finally {
    loading.value = false
    value.value = docHtml.value?.toc[0]?.id
  }
})

onMounted(() => {
  /** 监听滚动， 切换激活目录 */
  nextTick(() => {
    const { y } = useScroll(props.el?.$el.firstChild as HTMLElement | undefined)

    watch(
      y,
      (newVal) => {
        const { toc } = docHtml.value || {}
        if (!toc?.length || !isClient)
          return

        for (let i = 0; i < toc.length; i++) {
          const dom = document.querySelector(`#${toc[i].id}`) as HTMLElement
          const next = i < toc.length - 1 ? document.querySelector(`#${toc[i + 1].id}`)  as HTMLElement : null

          if (!dom)
            continue

          const top = dom.offsetTop + scrollTop.value
          const nextTop = next ? next.offsetTop + scrollTop.value : 0
          if (
            (i === 0 && newVal < top)
            || (!next && newVal >= top)
            || (newVal >= top && newVal < nextTop)
          ) {
            value.value = toc[i].id
            return
          }
        }
      }
    )
  })
})

/**
 * 解析文档文件
 */
async function parseDocFile(buffer: ArrayBuffer) {
  const res = await mammoth.convertToHtml({ arrayBuffer: buffer })
  resolveHTML(res.value)
}

/**
 * 解析html，生成目录
 */
function resolveHTML(html: string) {
  if (!isClient)
    return

  const article = document.createElement('article')
  article.innerHTML = html

  docHtml.value = {
    toc: [],
    article,
  }

  const hs = article.querySelectorAll('h1, h2, h3')
  const hsArr = Array.from(hs) as HTMLElement[]

  let id = 0
  for (const h of hsArr) {
    id++
    h.setAttribute('id', `toc_${id}`)
    docHtml.value.toc.push({
      id: `toc_${id}`,
      label: h.innerText,
    })
  }
}

/** 激活目录，滚动 */
function scroll(id: string) {
  value.value = id
  const { scrollTo } = props
  if (!id || !isClient || !scrollTo)
    return

  const dom = document.querySelector(`#${id}`) as HTMLElement
  if (dom) {
    const top = dom.offsetTop + scrollTop.value
    scrollTo(top, 'vertical', 300)
  }
}
</script>

<template>
  <!-- Main -->
  <div flex="~ gap4" sm="gap6" lg="gap8" xl="gap10" relative>
    <ZLoading :value="loading" />
    <Empty v-if="!docHtml?.article" label="管理员正在配置中" />
    <template v-else>
      <!-- Toc -->
      <div>
        <q-scroll-area
          sticky
          :style="{
            maxHeight,
            height: `${height}px`,
            width: `${width + 1}px`,
            top: `${top}px`
          }"
        >
          <ZMenu
            ref="toc"
            :model-value="value"
            :list="docHtml.toc"
            gap="0!"
            @update:model-value="val => scroll(val)"
          />
        </q-scroll-area>
      </div>
      <!-- Content -->
      <div
        class="richtext-content"
        pb4 flex="~ col 1 gap2" w0
        v-html="docHtml?.article.innerHTML"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.q-scrollarea {
  :deep(.q-scrollarea__content) {
    display: flex;
  }
}

:deep(.richtext-content) {
  > p {
    text-indent: 36px;
  }
}
</style>
