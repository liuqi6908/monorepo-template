<script setup lang="ts">
const { updateAppHead } = useApp()

onBeforeMount(() => {
  const { VITE_ADMIN_APP_NAME, VITE_ADMIN_APP_ICON } = import.meta.env
  updateAppHead(VITE_ADMIN_APP_NAME, VITE_ADMIN_APP_ICON)
})
</script>

<template>
  <RouterView />
</template>
