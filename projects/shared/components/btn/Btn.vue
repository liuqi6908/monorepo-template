<script setup lang="ts">
interface Props {
  color?: string
  size?: 'small' | 'medium' | 'big'
}

withDefaults(defineProps<Props>(), {
  color: 'primary-1',
  size: 'medium'
})
</script>

<template>
  <q-btn
    unelevated square :color="color"
    text-grey-1 min-h="inherit!"
    :px="size === 'big' ? 6 : 4"
    :py="size === 'big' ? 3 : size === 'medium' ? '10px' : '6px'"
    :text="size === 'big' ? 'base' : 'sm'"
  >
    <div flex="~ row items-center gap2">
      <slot />
    </div>
  </q-btn>
</template>
