<script setup lang="ts">
const { width } = useWindowSize()
const { baseWidth, isExpand, changeState } = useSidebar()
const { getOwnProfile } = useUser()

onMounted(getOwnProfile)
</script>

<template>
  <div flex>
    <AppSidebar z-999 />
    <RouterView
      :class="
        width >= baseWidth
        ? 'flex-1 w0'
        : 'absolute inset-0 left-20'
      "
    />
    <div
      v-if="width < baseWidth && isExpand"
      bg="black/40" flex-1 w0 z-999
      @click="() => changeState()"
    />
  </div>
</template>
