<script setup lang="ts">
import { useSysConfig } from '../../composables/app'

export interface ReadonlyInputProps {
  modelValue?: string | number
  label?: string
  caption?: string
  required?: boolean
}

defineProps<ReadonlyInputProps>()

const { isAdmin } = useSysConfig()
</script>

<template>
  <div flex="~ col gap2">
    <div
      v-if="label"
      text="sm grey-8" font-500 flex="~ gap1"
    >
      <div v-if="required" text-alerts-error>*</div>
      {{ label }}
      <div
        v-if="caption"
        text-grey-6 font-400
        v-text="caption"
      />
    </div>
    <div
      p="y2 x3" b="1px grey-3" h12 flex="~ items-center"
      bg-grey-2 text="base grey-4" font-400 truncate
      :rounded="isAdmin ? 2 : 0"
      v-text="modelValue"
    />
  </div>
</template>
