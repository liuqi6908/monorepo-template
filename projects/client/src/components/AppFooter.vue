<script lang="ts" setup>
import type { CmsJson } from 'shared/types/cms.interface'

const { getCms, getComponentById } = useCms()

/** 页脚组件参数 */
const footerProps = ref<CmsJson[]>()

onBeforeMount(async () => {
  footerProps.value = await getCms('footer', true)
})
</script>

<template>
  <component
    :is="getComponentById('footer')"
    :list="footerProps"
  />
</template>
