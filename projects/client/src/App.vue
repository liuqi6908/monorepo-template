<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { QScrollArea } from 'quasar'

const $route = useRoute()
const { width } = useWindowSize()
const { getAppConfig, updateAppHead } = useSysConfig()
const { el, scrollTo } = useScrollApp()

onBeforeMount(async () => {
  // 设置网站标题和logo
  await getAppConfig()
  updateAppHead()
})

/** 跳转路由滚动页面到顶部 */
watch(
  () => $route.name,
  () => {
    scrollTo(0)
  },
)

/** 监听窗口大小，缩放页面 */
watch(
  width,
  (newVal) => {
    if (isClient) {
      nextTick(() => {
        const body = document.body
        if (body) {
          if (newVal < APP_MIN_WIDTH) {
            body.style.transform = `scale(${newVal / APP_MIN_WIDTH})`
            body.style.width = `${APP_MIN_WIDTH / newVal * 100}%`
            body.style.height = `${APP_MIN_WIDTH / newVal * 100}%`
          }
          else {
            body.style.transform = ''
            body.style.width = '100%'
            body.style.height = '100%'
          }
        }
      })
    }
  },
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
  :deep() {
    .q-scrollarea__content {
      width: 100%;
    }

    > .q-scrollarea__bar {
      z-index: 998;
    }
    > .q-scrollarea__thumb {
      z-index: 999;
    }
  }
}
</style>
