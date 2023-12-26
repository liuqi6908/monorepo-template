<script setup lang="ts">
import type { CmsJson } from 'shared/types/cms.interface'

const { getCms } = useCms()

/** 首页 CMS 内容 */
const cmsList = reactive(CMS_CONFIG.filter(v => v.id.includes('home')).map((v) => {
  const { id, component } = v
  return {
    id,
    component,
    props: [] as CmsJson[] | undefined,
  }
}))
/** 问答管理参数 */
const questionProps = ref<CmsJson[]>()

onMounted(async () => {
  cmsList.forEach(async (item) => {
    item.props = await getCms(item.id, true)
  })
  questionProps.value = await getCms('question')
})
</script>

<template>
  <div>
    <component
      :is="item.component"
      v-for="item in cmsList"
      :key="item.id"
      :list="item.props"
    />

    <!-- 常见问题 -->
    <div py20 bg="grey-2">
      <div w-limited-1 flex="~ row wrap" gap="y10 x20">
        <RouterLink
          v-for="(item, index) in questionProps?.filter((_, i) => i < 4)"
          :key="index"
          :to="{
            path: '/question',
            query: {
              title: item.title,
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
