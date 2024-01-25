<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'
import type { QInputProps, QInputSlots } from 'quasar'
import { useSysConfig } from '../../composables/app'

export interface ZInputProps {
  modelValue?: string | number
  label?: string
  caption?: string
  placeholder?: string
  dark?: boolean
  password?: boolean
  required?: boolean
  size?: 'small' | 'medium' | 'big'
  type?: QInputProps['type']
  params?: Omit<QInputProps, 'modelValue' | 'label' | 'placeholder' | 'dark' | 'type'>
}

const props = withDefaults(defineProps<ZInputProps>(), {
  dark: false,
  password: false,
  size: 'big',
})
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { isAdmin } = useSysConfig()

/** 输入框类型是否为password */
const isPwd = ref(true)

/**
 * 加减数值
 */
function valuePlusMinus(type: 'plus' |'minus') {
  const num = Number(value.value)
  if (Number.isNaN(num))
    value.value = 0
  else if (type === 'plus')
    value.value = num + 1
  else if (type ==='minus')
    value.value = num - 1
}
</script>

<template>
  <div class="z-input" flex="~ col gap2">
    <div
      v-if="label"
      text-sm font-500 flex="~ gap1"
      :text="dark ? 'grey-1' : 'grey-8'"
    >
      <div v-if="required" text-alerts-error>*</div>
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
      :class="size + (isAdmin ? ' is-admin' : '')"
      dense outlined
      :dark="dark"
      :color="dark ? 'grey-1' : 'primary-1'"
      :placeholder="placeholder"
      :type="type ?? (password && isPwd ? 'password' : 'text')"
      v-bind="params"
    >
      <template
        v-for="(_, slotName) of ($slots as Readonly<QInputSlots>)"
        :key="slotName"
        #[slotName]
      >
        <slot :name="slotName" />
      </template>
      <template #append>
        <div
          v-if="password"
          :class="isPwd ? 'i-material-symbols:visibility-off-outline' : 'i-material-symbols:visibility-outline' "
          cursor-pointer :text="dark ? 'grey-1' : 'grey-4'"
          :w="size === 'small' ? 5 : 6"
          :h="size === 'small' ? 5 : 6"
          @click="isPwd = !isPwd"
        />
        <div
          v-else-if="type === 'number'"
          class="number-input-controller"
          flex="col gap0.5" hidden
        >
          <div
            w4 h4 rounded-1 cursor-default
            bg-grey-2 text-grey-5
            hover="bg-grey-4 text-grey-1"
            @click="valuePlusMinus('plus')"
          >
            <div full i-carbon:caret-up />
          </div>
          <div
            w4 h4 rounded-1 cursor-default
            bg-grey-2 text-grey-5
            hover="bg-grey-4 text-grey-1"
            @click="valuePlusMinus('minus')"
          >
            <div full i-carbon:caret-down />
          </div>
        </div>
        <slot name="append" />
      </template>
    </q-input>
  </div>
</template>

<style lang="scss">
.z-input {
  .q-field {
    /** textarea */
    &.q-textarea {
      .q-field__control {
        padding-right: 0;
        height: auto;

        textarea {
          min-height: 48px;
          max-height: 300px;
        }
      }
    }

    /** number */
    input[type="number"] {
      appearance: textfield;
      -moz-appearance: textfield;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
      }
    }
    &:hover {
      .number-input-controller {
        display: flex;
      }
    }
  }
}
</style>