<script lang="ts" setup>
// 初始化 router
globalRouter.value = useRouter() as any
</script>

<template>
  <RouterView full />
</template>
