<script setup lang="ts">
import database from '~/assets/empty/database.svg?raw'
import desktop from '~/assets/empty/desktop.svg?raw'
import verify from '~/assets/empty/verify.svg?raw'
import works from '~/assets/empty/works.svg?raw'

interface Props {
  label: string
  captions?: string
  icon?: keyof (typeof icons)
}

withDefaults(defineProps<Props>(), {
  icon: 'works'
})

const icons = {
  database,
  desktop,
  verify,
  works,
}
</script>

<template>
  <div w-full flex="col center gap-6">
    <div v-html="icons[icon]" />
    <div flex="col center gap-2">
      <div
        text="lg grey-8"
        v-text="label"
      />
      <div
        v-if="captions"
        text="sm grey-5"
        v-text="captions"
      />
    </div>
  </div>
</template>

<style>

</style>
