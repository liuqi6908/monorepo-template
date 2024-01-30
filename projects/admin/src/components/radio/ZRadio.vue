<script lang="ts" setup>
import type { QRadioProps } from 'quasar'

interface ZRadioProps {
  modelValue?: QRadioProps['modelValue']
  val?: QRadioProps['val']
  label?: string
  params?: Omit<QRadioProps, 'modelValue' | 'val' | 'label'>
}

const props = defineProps<ZRadioProps>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
</script>

<template>
  <q-radio
    v-model="value"
    class="z-radio"
    :val="val"
    :label="label"
    checked-icon="fas fa-check"
    v-bind="params"
  >
    <slot />
  </q-radio>
</template>

<style lang="scss" scoped>
.z-radio {
  &[aria-checked="true"] {
    :deep(.q-radio__inner) {
      .q-radio__icon {
        background-color: currentColor;
        border-radius: 10px;
        font-size: 20px;

        &::before {
          color: var(--grey-1);
          font-size: 12px;
        }
      }
    }
  }

  :deep(.q-radio__inner) {
    font-size: 36px;
  }

  :deep(.q-radio__label) {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
