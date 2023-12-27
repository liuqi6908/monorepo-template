<script lang="ts" setup>
defineProps<{
  value?: boolean
}>()
</script>

<template>
  <q-inner-loading
    :showing="value"
    label="加载中..."
    text-primary-1
    z9
  />
</template>
