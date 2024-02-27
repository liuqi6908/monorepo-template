<script setup lang="ts">
const { updateAppHead } = useApp()

onBeforeMount(() => {
  const { VITE_CLIENT_APP_NAME, VITE_CLIENT_APP_ICON } = import.meta.env
  updateAppHead(VITE_CLIENT_APP_NAME, VITE_CLIENT_APP_ICON)
})
</script>

<template>
  <RouterView />
</template>
