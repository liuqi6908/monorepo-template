<script lang="ts" setup>
interface Props {
  img: string
  title: string
}

defineProps<Props>()
</script>

<template>
  <div relative>
    <img h64 w-full object-cover :src="img" />
    <h1 absolute-center v-text="title" />
  </div>
</template>
