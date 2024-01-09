<script lang="ts" setup>
import type { CmsJson } from 'shared/types/cms.interface'

const { getCms, getComponentById } = useCms()

/** 首页拓展参数 */
const expandProps = ref<CmsJson[]>()

onBeforeMount(async () => {
  expandProps.value = await getCms('homeExpand', true)
})
</script>

<template>
  <component
    :is="getComponentById(item.componentId)"
    v-for="(item, index) in expandProps"
    :key="index"
    :list="[item]"
  />
</template>
