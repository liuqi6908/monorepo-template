<script setup lang="ts">
import type { CmsJson } from 'shared/types/cms.interface'
import bg from '~/assets/bg/question.webp'

const { getCms, getComponentById } = useCms()

/** 加载中 */
const loading = ref(false)
/** 问答管理页面id */
const id = 'question'
/** 问答管理参数 */
const questionProps = ref<CmsJson[]>()

onBeforeMount(async () => {
  loading.value = true
  try {
    questionProps.value = await getCms(id, true)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <Banner :img="bg" title="常见问题解答(Q&A)" />
    <div relative min-h-100>
      <ZLoading :value="loading" />
      <component
        :is="getComponentById(id)"
        :list="questionProps"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
