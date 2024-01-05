<script setup lang="ts">
import type { CmsJson } from 'shared/types/cms.interface'

const { getCms } = useCms()

/** 加载中 */
const loading = ref(false)
/** 数据上传页面id */
const id = 'uploadDescribe'
/** 数据上传参数 */
const uploadProps = ref<CmsJson[]>()

onBeforeMount(async () => {
  loading.value = true
  try {
    uploadProps.value = await getCms(id, true)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div relative min-h-60>
    <ZLoading :value="loading" />
    <Empty v-if="!uploadProps?.[0]?.richText" label="管理员正在配置中" />
    <div v-else v-html="uploadProps?.[0]?.richText" />
  </div>
</template>
