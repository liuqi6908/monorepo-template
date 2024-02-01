<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'

interface ZExpansionProps {
  label?: string
  initialValue?: boolean
  top?: boolean
}
const { initialValue } = defineProps<ZExpansionProps>()

const value = ref(false)

onBeforeMount(() => {
  if (initialValue)
    value.value = true
})
</script>

<template>
  <div
    bg-grey-2 flex="~ col" pr2
    :py="top ? 2 : 1" :pl="top ? 2 : 7"
  >
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
        <h4
          :class="top ? '' : 'text-lg'"
          truncate
          v-text="label"
        />
      </slot>
    </q-item>

    <!-- Content -->
    <q-expansion-item
      v-model="value"
      header-class="display-none"
    >
      <slot />
    </q-expansion-item>
  </div>
</template>
