<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { QSelectProps } from 'quasar'

import ZLabel from '../label/ZLabel.vue'
import type { ZLabelProps } from '../label/ZLabel.vue'
import { useSysConfig } from '../../composables/app'

export interface ZSelectProps extends ZLabelProps {
  modelValue: any
  options?: any[]
  placeholder?: string
  size?: 'small' | 'medium' | 'big'
  params?: Omit<QSelectProps, 'modelValue' | 'options' | 'label' | 'placeholder' | 'dark'>
}

const props = withDefaults(defineProps<ZSelectProps>(), {
  password: false,
  size: 'big',
})
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { isAdmin } = useSysConfig()
</script>

<template>
  <div class="z-select" flex="~ col gap2">
    <ZLabel v-bind="props" />
    <q-select
      v-model="value"
      :class="size + (isAdmin ? ' is-admin' : '')"
      dense outlined
      :options="options"
      :dark="dark"
      :color="dark ? 'grey-1' : 'primary-1'"
      dropdown-icon="fa fa-chevron-down"
      :popup-content-class="`z-select-dropdown-menu${isAdmin ? ' is-admin' : ''}`"
      :menu-offset="[0, 8]"
      v-bind="params"
    >
      <template v-if="placeholder && !value" #prepend>
        <div
          text-grey-5 font-400 opacity-70
          :text="size === 'small' ? 'sm' : 'base'"
          v-text="placeholder"
        />
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

      .q-field__native {
        min-height: auto;
        padding: 0;
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
  border-radius: 0;
  padding: 8px 0;
  color: var(--grey-8);

  .q-item {
    text-align: center;

    .q-focus-helper {
      opacity: 0.1 !important;
    }

    &:hover > .q-focus-helper {
      opacity: 0.1 !important;
    }
  }

  &.is-admin {
    border-radius: 8px;
    border: 1px solid var(--grey-3);
    padding: 4px;
    box-shadow: 0px 0px 24px 0px #0C337314, 0px 0px 12px 0px #0C337314;

    .q-item {
      border-radius: 8px;
    }
  }
}
</style>