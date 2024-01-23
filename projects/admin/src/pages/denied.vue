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
  <div bg="grey-1!">
    <Empty label="您没有访问权限">
      <ZBtn label="返回首页" size="big" self-center @click="backHome" />
    </Empty>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
