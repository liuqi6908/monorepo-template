<script setup lang="ts">
import type { CmsJson } from 'shared/types/cms.interface'
import HomeExpand from '~/views/home/HomeExpand.vue'

const { getCms, getComponentById } = useCms()

/** 加载中 */
const loading = ref(false)
/** 首页 CMS 内容 */
const cmsList = reactive(CMS_CONFIG.filter((_, i) => i < 2).map((v) => {
  const { id, component } = v
  return {
    id,
    component,
    props: [] as CmsJson[] | undefined,
  }
}))
/** 问答管理参数 */
const questionProps = ref<CmsJson[]>()

/** 是否展示首页拓展 */
const isShowHomeExpand = getEnvVariable('VITE_HOME_EXPAND')

onBeforeMount(async () => {
  loading.value = true
  try {
    cmsList.forEach(async (item) => {
      item.props = await getCms(item.id, true)
    })
    questionProps.value = await getCms('question', true)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div relative flex="~ col gap20">
    <ZLoading :value="loading" />

    <component
      :is="getComponentById(item.id)"
      v-for="item in cmsList"
      :key="item.id"
      :list="item.props"
    />

    <!-- 首页拓展 -->
    <HomeExpand v-if="isShowHomeExpand" />

    <!-- 常见问题 -->
    <div py20 bg="grey-2">
      <div w-limited-1 flex="~ row wrap" gap="y10 x20">
        <RouterLink
          v-for="(item, index) in questionProps?.filter((_, i) => i < 4)"
          :key="index"
          :to="{
            path: '/question',
            query: {
              index,
            },
          }"
          flex-1 min-w-112
        >
          <QuestionCard v-bind="{ ...item }" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
