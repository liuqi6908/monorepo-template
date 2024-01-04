<script lang="ts" setup>
const { isDesktop, isVerify } = useUser()
const { el, scrollTo } = useScrollApp()

/** 标签页列表 */
const tabList = computed(() => {
  return [
    {
      label: '数据外发',
      id: 'export',
      component: defineAsyncComponent(() => import('~/views/userCenter/myData/Export.vue'))
    },
    {
      label: '历史记录',
      id: 'history',
      component: defineAsyncComponent(() => import('~/views/userCenter/myData/History.vue'))
    },
    {
      label: '数据上传',
      id: 'uploading',
      component: defineAsyncComponent(() => import('~/views/userCenter/myData/Uploading.vue')),
      flag: true
    },
  ].filter(v => (isDesktop.value && isVerify.value) || v.flag)
})
/** 当前页面 */
const value = ref<string>()

onMounted(() => {
  watch(
    tabList,
    (newVal) => {
      value.value = newVal[0].id
    },
    {
      immediate: true,
    }
  )
})

watch(
  value,
  () => {
    if (el.value) {
      if (el.value.getScrollPosition().top > 265)
        scrollTo(265)
    }
  }
)
</script>

<template>
  <div flex="~ col">
    <ZMenu1 v-model="value" :list="tabList" bg-grey-1 sticky top-41 z-1 pb4 />
    <component :is="tabList.find(v => v.id === value)?.component" />
  </div>
</template>

<style lang="scss" scoped>
.z-menu-1 {
  &::before {
    content: '';
    position: absolute;
    top: -40px;
    left: 0;
    right: 0;
    height: 40px;
    background-color: var(--grey-1);
  }
}
</style>

<route lang="yaml">
meta:
  layout: userCenter
</route>
