<script setup lang="ts">
import { ref } from 'vue'
import type { QInputProps } from 'quasar'

export interface ZInputProps {
  modelValue: string
  label?: string
  placeholder?: string
  dark?: boolean
  password?: boolean
  params?: Omit<QInputProps, 'modelValue' | 'placeholder' | 'dark'>
}

const { params } = withDefaults(defineProps<ZInputProps>(), {
  dark: false,
  password: false,
})
defineEmits(['update:modelValue'])

/** 输入框类型是否为password */
const isPwd = ref(true)
</script>

<template>
  <div class="z-input" flex="~ col gap2">
    <div
      v-if="label"
      text-sm font-500
      :text="dark ? 'grey-1' : 'grey-8'"
      v-text="label"
    />
    <q-input
      :model-value="modelValue"
      dense outlined
      :dark="dark"
      :color="dark ? 'grey-1' : 'primary-1'"
      :placeholder="placeholder"
      :type="password && isPwd ? 'password' : 'text'"
      v-bind="params"
      @update:model-value="val => $emit('update:modelValue', val)"
    >
      <template #append>
        <div
          v-if="password"
          :class="isPwd ? 'i-material-symbols:visibility-off-outline' : 'i-material-symbols:visibility-outline' "
          cursor-pointer text-xl :text="dark ? 'grey-1' : 'grey-4'"
          @click="isPwd = !isPwd"
        />
        <slot />
      </template>
    </q-input>
  </div>
</template>

<style lang="scss">
.z-input {
  --q-negative: #FF8080;

  .q-field {
    .q-field__control {
      height: 48px;
      min-height: 48px;
      border-radius: 0;

      .q-field__append {
        height: inherit;
        margin-left: 6px;
      }

      .text-negative {
        font-size: 20px;
      }

      .q-field__label {
        top: 14px;
        color: var(--grey-5);
      }

      input {
        font-size: 16px;
        line-height: 24px;
        color: var(--grey-8);
        &::-webkit-input-placeholder {
          color: var(--grey-5);
        }
      }

      &::before {
        border-color: var(--grey-3)
      }
      &:hover::before {
        border-color: var(--grey-4)
      }
      &::after {
        border-width: 1px !important
      }
    }

    &--dark {
      .q-field__control {
        .q-field__label {
          color: var(--white-7);
        }

        input {
          color: var(--grey-1);
          &::-webkit-input-placeholder {
            color: var(--white-7);
          }
        }

        &::before {
          border-color: var(--white-7);
        }
        &:hover::before {
          border-color: var(--white-9);
        }
      }
    }

    .q-field__bottom {
      padding-left: 0;
    }
  }
}
</style>