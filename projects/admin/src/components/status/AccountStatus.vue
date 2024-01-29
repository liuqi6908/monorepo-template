<script lang="ts" setup>
withDefaults(
  defineProps<{ disable?: boolean }>(),
  {
    disable: true,
  },
)
</script>

<template>
  <div
    flex="center gap2"
    text="sm grey-8" font-400
    select-none
  >
    <div w2 h2 rounded-full :bg="disable ? 'alerts-error' : 'alerts-success'" />
    <div v-text="disable ? '禁用' : '正常'" />
  </div>
</template>
