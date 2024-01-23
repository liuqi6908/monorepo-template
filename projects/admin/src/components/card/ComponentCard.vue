<script lang="ts" setup>
interface Props {
  label?: string
  icon?: string
  color?: string
}

withDefaults(defineProps<Props>(), {
  color: '#025CB9',
})
</script>

<template>
  <div
    py12 rounded-2 b="1px dashed"
    :style="{
      borderColor: color,
      backgroundColor: `${color}0d`,
    }" cursor-pointer
    hover:border-solid
    flex="~ col items-center gap2"
  >
    <div v-html="icon" />
    <div text-base font-600 v-text="label" />
  </div>
</template>
