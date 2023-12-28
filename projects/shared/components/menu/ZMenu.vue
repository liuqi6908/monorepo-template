<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

export interface ZMenuProps {
  modelValue?: string | number
  list?: {
    id: string | number
    label: string
    to?: string | {
      path?: string
      query?: Record<string, string | undefined>
    }
  }[]
}

const props = defineProps<ZMenuProps>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
</script>

<template>
  <q-list flex="~ col gap2" text-grey-8>
    <q-item
      v-for="{ id, label, to } in list"
      :key="id"
      :to="to"
      :active="value === id"
      active-class="bg-gray-2"
      clickable max-w-30 min-w-12 p="y2.5 x4"
      sm="max-w-36" lg="max-w-42" xl="max-w-50"
      text-nowrap font-600 items-center
      @click="value = id"
    >
      <div
        :text="value === id ? 'primary-1' : 'grey-8'"
        truncate
      >
        {{ label }}
      </div>
    </q-item>
  </q-list>
</template>
