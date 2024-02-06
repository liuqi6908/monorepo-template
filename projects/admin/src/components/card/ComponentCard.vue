<script lang="ts" setup>
interface Props {
  label?: string
  icon?: string
  color?: string
}

defineProps<Props>()
</script>

<template>
  <div
    py12 rounded-2 b="1px dashed"
    :style="{
      borderColor: color ? color : 'var(--primary-1)',
      backgroundColor: color ? `${color}0d` : 'var(--primary-1-bg)',
    }" cursor-pointer
    hover:border-solid
    flex="~ col items-center gap2"
  >
    <div v-html="icon" />
    <div text-base font-600 v-text="label" />
  </div>
</template>
