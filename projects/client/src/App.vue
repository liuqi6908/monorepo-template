<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { QScrollArea } from 'quasar'

const $route = useRoute()
const { width } = useWindowSize()
const { appName, appIcon, getAppConfig } = useApp()
const { el, scrollTo } = useScrollApp()

onBeforeMount(async () => {
  await getAppConfig()
  useHead({
    title: appName.value,
    meta: [
      {
        name: 'description',
        content: `「${appName.value}」是一整套供科研人员处理分析大数据和开展学术研究的云端超融合系统的简称。`,
      },
    ],
    link: [
      {
        rel: 'icon',
        href: appIcon.value,
      },
    ],
  })
})

watch(
  () => $route.name,
  () => {
    scrollTo(0)
  },
)

const debouncedFn = useDebounceFn((width: number) => {
  if (isClient) {
    nextTick(() => {
      const body = document.body
      if (body) {
        if (width < APP_MIN_WIDTH) {
          body.style.transform = `scale(${width / APP_MIN_WIDTH})`
          body.style.width = `${APP_MIN_WIDTH / width * 100}%`
          body.style.height = `${APP_MIN_WIDTH / width * 100}%`
        }
        else {
          body.style.transform = ''
          body.style.width = '100%'
          body.style.height = '100%'
        }
      }
    })
  }
}, 300)

watch(
  width,
  debouncedFn,
  {
    immediate: true,
  },
)
</script>

<template>
  <QScrollArea ref="el" full>
    <RouterView />
  </QScrollArea>
</template>

<style lang="scss" scoped>
.q-scrollarea {
  :deep(> .q-scrollarea__thumb) {
    z-index: 999;
  }
}
</style>
