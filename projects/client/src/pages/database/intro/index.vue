<script lang="ts" setup>
import * as mammoth from 'mammoth'
import { isClient } from '@vueuse/core'

/** 目录元素 */
const toc = ref<HTMLElement>()

const { rootData, rootId, databaseId } = useDatabase()
const { query } = useRoute() as {
  query: Record<string, string>
}
const $router = useRouter()
const { width, height } = useElementSize(toc)
const { el, scrollTo } = useScrollApp()

/** 数据库的英文名 */
const nameEN = ref<string>()
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

onBeforeMount(async () => {
  rootId.value = query.rootId
  nameEN.value = query.nameEN
  if (!rootId.value || !nameEN.value)
    return $router.replace('/database')

  databaseId.value = rootData.value?.find(v => v.nameEN === nameEN.value)?.id
  loading.value = true

  try {
    const res = await getDbIntroApi(rootId.value, `${nameEN.value}.docx`)
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
    const { y } = useScroll(el.value?.$el.firstChild as HTMLElement | undefined)

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

          const top = dom.offsetTop + 100
          const nextTop = next ? next.offsetTop + 100 : 0
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
  if (!id || !isClient)
    return

  const dom = document.querySelector(`#${id}`) as HTMLElement
  if (dom) {
    const top = dom.offsetTop + 100
    scrollTo(top, 'vertical', 300)
  }
}
</script>

<template>
  <div w-limited-1 flex="~ col gap6" pb20>
    <!-- Header -->
    <div py6>
      <RouterLink
        :to="{
          path: '/database',
          query: {
            rootId,
            databaseId,
          }
        }"
        flex="~ items-center gap4"
      >
        <div w8 h8 flex-center>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z" fill="#6E7686"/>
          </svg>
        </div>
        <h4 text-grey-8>
          数据库介绍
        </h4>
      </RouterLink>
    </div>

    <!-- Main -->
    <div flex="~ gap4" sm="gap6" lg="gap8" xl="gap10" relative>
      <ZLoading :value="loading" />
      <Empty v-if="!docHtml?.article" label="暂无数据库介绍" />
      <template v-else>
        <!-- Toc -->
        <div>
          <q-scroll-area
            sticky top-36
            :style="{
              maxHeight: 'calc(100vh - 144px)',
              height: `${height}px`,
              width: `${width + 1}px`
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
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

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
