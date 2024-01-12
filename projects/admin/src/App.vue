<script setup lang="ts">
import { isClient } from '@vueuse/core'

const { width } = useWindowSize()
const { app, isAdmin, getAppConfig } = useSysConfig()

onBeforeMount(async () => {
  isAdmin.value = true
  // 设置网站标题和logo
  await getAppConfig()
  useHead({
    title: `${app.value?.name} - 管理后台`,
    meta: [
      {
        name: 'description',
        content: `「${app.value?.name}」是一整套供科研人员处理分析大数据和开展学术研究的云端超融合系统的简称。`,
      },
    ],
    link: [
      {
        rel: 'icon',
        href: app.value?.icon,
      },
    ],
  })
})

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
  <RouterView full />
</template>
