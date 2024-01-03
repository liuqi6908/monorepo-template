<script setup lang="ts">
import database from '~/assets/empty/database.svg?raw'
import desktop from '~/assets/empty/desktop.svg?raw'
import verify from '~/assets/empty/verify.svg?raw'
import works from '~/assets/empty/works.svg?raw'

interface EmptyProps {
  icon?: keyof (typeof icons)
  label?: string
  captions?: string
}

withDefaults(defineProps<EmptyProps>(), {
  icon: 'works',
  label: '暂无数据',
})

const icons = {
  database,
  desktop,
  verify,
  works,
}
</script>

<template>
  <div class="empty" w-full p="t20 b80" flex="~ col items-center gap10">
    <div flex="~ col items-center gap6">
      <div v-html="icons[icon]" />
      <div flex="~ col items-center gap2" text-center>
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
      <slot />
    </div>
    <slot name="bottom" />
  </div>
</template>
