<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'
import type { QInputProps } from 'quasar'

export interface ZInputProps {
  modelValue?: string
  label?: string
  caption?: string
  placeholder?: string
  dark?: boolean
  password?: boolean
  required?: boolean
  params?: Omit<QInputProps, 'modelValue' | 'placeholder' | 'dark'>
}

const props = withDefaults(defineProps<ZInputProps>(), {
  dark: false,
  password: false,
})
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')

/** 输入框类型是否为password */
const isPwd = ref(true)
</script>

<template>
  <div class="z-input" flex="~ col gap2">
    <div
      v-if="label"
      text-sm font-500 flex="~ gap1"
      :text="dark ? 'grey-1' : 'grey-8'"
    >
      <div v-if="required" text-alert-error>*</div>
      {{ label }}
      <div
        v-if="caption"
        :text="dark ? 'white-7' : 'grey-6'"
        font-400
        v-text="caption"
      />
    </div>
    <q-input
      v-model="value"
      dense outlined
      :dark="dark"
      :color="dark ? 'grey-1' : 'primary-1'"
      :placeholder="placeholder"
      :type="password && isPwd ? 'password' : 'text'"
      v-bind="params"
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
  .q-field {
    &.q-textarea {
      background-color: var(--grey-2);
      &.q-field--dark {
        background-color: transparent;
      }

      .q-field__control {
        padding-right: 0;

        textarea {
          min-height: 48px;
          max-height: 300px;
        }
      }
    }
  }
}
</style>