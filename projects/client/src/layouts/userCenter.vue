<script lang="ts" setup>
import bg from '~/assets/bg/user.webp'
import HomeLayout from './home.vue'
</script>

<template>
  <HomeLayout layout>
    <Banner text-grey-1 :img="bg" title="用户中心" />
    <RouterView />
  </HomeLayout>
</template>
