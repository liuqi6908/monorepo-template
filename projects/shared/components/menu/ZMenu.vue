<script lang="ts" setup>
export interface ZMenuProps {
  modelValue?: string | number
  list?: {
    id: string | number
    label: string
    to?: string | { path: string; query?: Record<string, string> }
  }[]
}

defineProps<ZMenuProps>()
defineEmits(['update:modelValue'])
</script>

<template>
  <q-list flex="~ col gap2" text-grey-8>
    <q-item
      v-for="item in list"
      :key="item.id"
      :to="item.to"
      :active="modelValue === item.id"
      active-class="bg-gray-2"
      clickable max-w-50 min-w-12 p="y2.5 x4" text-nowrap font-600
      @click="$emit('update:modelValue', item.id)"
    >
      <div :text="modelValue === item.id ? 'primary-1' : 'grey-8'">
        {{ item.label }}
      </div>
    </q-item>
  </q-list>
</template>
