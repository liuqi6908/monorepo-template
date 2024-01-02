<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { QSelectProps } from 'quasar'

export interface ZSelectProps {
  modelValue: any
  options?: any[]
  label?: string
  placeholder?: string
  dark?: boolean
  required?: boolean
  params?: Omit<QSelectProps, 'modelValue' | 'options' | 'placeholder' | 'dark'>
}

const props = withDefaults(defineProps<ZSelectProps>(), {
  dark: false,
  password: false,
})
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
</script>

<template>
  <div class="z-select" flex="~ col gap2">
    <div
      v-if="label"
      text-sm font-500 flex="~ gap1"
      :text="dark ? 'grey-1' : 'grey-8'"
    >
      <div v-if="required" text-alert-error>*</div>
      {{ label }}
    </div>
    <q-select
      v-model="value"
      dense outlined
      :options="options"
      :dark="dark"
      :color="dark ? 'grey-1' : 'primary-1'"
      dropdown-icon="fa fa-chevron-down"
      popup-content-class="z-select-dropdown-menu rounded-0 shadow-none py2 text-grey-8"
      :menu-offset="[0, 8]"
      v-bind="params"
    >
      <template v-if="placeholder && !value" #prepend>
        <div text="base grey-5" font-400 opacity-70 v-text="placeholder" />
      </template>
    </q-select>
  </div>
</template>

<style lang="scss">
.z-select {
  .q-field {
    .q-field__control {
      .q-field__prepend {
        position: absolute;
      }

      .q-field__append {
        .q-icon {
          width: 24px;
          font-size: 14px;
          color: var(--grey-4);
        }
      }
    }

    &--dark {
      .q-field__append {
        .q-icon {
          color: var(--white-7) !important;
        }
      }
    }
  }
}

.z-select-dropdown-menu {
  box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  .q-item {
    text-align: center;

    .q-focus-helper {
      opacity: 0.1 !important;
    }

    &:hover > .q-focus-helper {
      opacity: 0.1 !important;
    }
  }
}
</style>