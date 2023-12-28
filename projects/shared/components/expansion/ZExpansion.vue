<script lang="ts" setup>
import { ref } from 'vue'

interface ZExpansionProps {
  label?: string
  initialValue?: boolean
}
defineProps<ZExpansionProps>()

const value = ref(false)
</script>

<template>
  <div bg-grey-2 p2 flex="~ col">
    <!-- Label -->
    <q-item
      clickable flex="~ items-center gap1"
      p2 min-h-auto
      @click="value = !value"
    >
      <div
        :style="{ transform: value ? 'rotate(0deg)' : 'rotate(180deg)' }"
        h6 w6 flex-center transition-all
      >
        <slot name="dropdown-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 14L12 9L17 14H7Z" fill="#A6B1C2"/>
          </svg>
        </slot>
      </div>
      <slot name="label">
        <h4 truncate v-text="label" />
      </slot>
    </q-item>

    <!-- Content -->
    <q-expansion-item
      :model-value="initialValue || value"
      header-class="display-none"
      @update:model-value="val => value = val"
    >
      <slot />
    </q-expansion-item>
  </div>
</template>
