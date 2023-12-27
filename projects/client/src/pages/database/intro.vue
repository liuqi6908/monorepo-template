<script lang="ts" setup>
import * as mammoth from 'mammoth'
import { isClient } from '@vueuse/core'

const { rootData, rootId, databaseId } = useDatabase()
const { query } = useRoute() as {
  query: Record<string, string>
}
const $router = useRouter()

/** 数据库的英文名 */
const nameEN = ref<string>()
/** 加载中 */
const loading = ref(false)
/** 文档 */
const docHtml = ref<{
  toc: {
    id: number
    label: string
    level: number
  }[]
  article: HTMLElement
}>()

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
  }
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
    const level = Number(h.tagName.slice(1))
    h.setAttribute('id', id.toString())
    docHtml.value.toc.push({
      id,
      label: h.innerText,
      level,
    })
  }
}
</script>

<template>
  <div w-limited-1 flex="~ col gap6">
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
      <ZEmpty label="暂无数据库介绍" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
