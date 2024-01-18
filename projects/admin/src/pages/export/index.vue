<script setup lang="ts">
onBeforeMount(() => {
  console.log('init：文件外发')
})
</script>

<template>
  <div>
    文件外发
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
