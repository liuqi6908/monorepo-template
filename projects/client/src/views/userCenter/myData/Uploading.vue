<script setup lang="ts">
import type { CmsJson } from 'shared/types/cms.interface'

const { getCms, getComponentById } = useCms()

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
  <div relative min-h-100>
    <ZLoading :value="loading" />
    <component
      :is="getComponentById(id)"
      :list="uploadProps"
    />
  </div>
</template>
