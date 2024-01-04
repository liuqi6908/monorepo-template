<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { omit } from 'zjf-utils'
import ZSelect from './ZSelect.vue'
import type { ZSelectProps } from './ZSelect.vue'

export interface ZChipSelectProps extends ZSelectProps {}

const props = defineProps<ZChipSelectProps>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
</script>

<template>
  <ZSelect
    v-model="value"
    class="z-chip-select"
    :params="{
      ...props.params ?? {},
      inputDebounce: 0,
      multiple: true,
      useChips: true,
    }"
    v-bind="omit(props, 'modelValue', 'params')"
  />
</template>

<style lang="scss" scoped>
.z-chip-select {
  :deep(.q-field__control) {
    .q-field__native {
      gap: 16px;

      .q-chip {
        margin: 0;
        padding: 4px 8px;
        height: auto;
        gap: 2px;
        background: var(--grey-2);

        .q-chip__content {
          color: var(--grey-8);
          font-size: 16px;
          line-height: 24px;
        }

        .q-icon {
          font-size: 16px;
          color: var(--grey-4);
          margin: 0;
        }
      }
    }

    .q-field__append {
      margin-left: 16px;
    }
  }
}
</style>
