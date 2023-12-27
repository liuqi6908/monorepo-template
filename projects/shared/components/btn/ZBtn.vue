<script setup lang="ts">
import type { QBtnProps } from 'quasar'

interface ZBtnProps {
  color?: string
  textColor?: string
  label?: string
  size?: 'small' | 'medium' | 'big'
  disable?: boolean
  params?: Omit<QBtnProps, 'color' | 'textColor' | 'label' | 'size' | 'disable'>
}

const { params } = withDefaults(defineProps<ZBtnProps>(), {
  color: 'primary-1',
  textColor: 'grey-1',
  size: 'medium',
})
</script>

<template>
  <q-btn
    class="z-btn"
    unelevated square
    min-h="inherit!"
    :px="size === 'big' ? 6 : 4"
    :py="size === 'big' ? 3 : size === 'medium' ? '10px' : '6px'"
    :text="size === 'big' ? 'base' : 'sm'"
    :color="color"
    :text-color="textColor"
    :label="label"
    :disable="disable"
    v-bind="params"
  >
    <div flex="~ row items-center gap2">
      <slot />
    </div>
  </q-btn>
</template>
