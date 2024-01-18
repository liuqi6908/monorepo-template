<script setup lang="ts">
/**
 * 返回首页
 */
function backHome() {
  const url = window.location.origin
  window.location.replace(url)
}
</script>

<template>
  <div flex="center col gap4">
    <q-icon name="fas fa-exclamation-triangle" size="8rem" color="red-6" />
    <div text="xl red">
      您没有权限访问
    </div>
    <ZBtn label="返回首页" size="big" @click="backHome" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
