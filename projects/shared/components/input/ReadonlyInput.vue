<script setup lang="ts">
import ZLabel from '../label/ZLabel.vue'
import type { ZLabelProps } from '../label/ZLabel.vue'
import { useSysConfig } from '../../composables/app'

export interface ReadonlyInputProps extends ZLabelProps {
  modelValue?: string | number
}

const props = defineProps<ReadonlyInputProps>()

const { isAdmin } = useSysConfig()
</script>

<template>
  <div flex="~ col gap2">
    <ZLabel v-bind="props" />
    <div
      p="y2 x3" b="1px grey-3" h12 flex="~ items-center"
      bg-grey-2 text="base grey-4" font-400 truncate
      :rounded="isAdmin ? 2 : 0"
      v-text="modelValue"
    />
  </div>
</template>
