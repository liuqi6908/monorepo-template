<script lang="ts" setup>
interface BannerProps {
  img: string
  title?: string
}

defineProps<BannerProps>()
</script>

<template>
  <div relative>
    <img h64 w-full object-cover :src="img" />
    <h1 absolute-center w="90%" text-center line-clamp-5 v-text="title" />
  </div>
</template>
