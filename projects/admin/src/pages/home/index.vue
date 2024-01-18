<script setup lang="ts">
onBeforeMount(() => {
  console.log('init：首页')
})
</script>

<template>
  <div>
    首页
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
