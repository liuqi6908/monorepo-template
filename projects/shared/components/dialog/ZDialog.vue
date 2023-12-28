<script lang="ts" setup>
import type { QDialogProps } from 'quasar'
import ZBtn from '../btn/ZBtn.vue'

interface ZDialogProps {
  modelValue: boolean
  title: string
  caption?: string
  footer?: boolean
  disableConfirm?: boolean
  cancelText?: string
  confirmText?: string
  wrapperStyle?: Record<string, any>
  /** 是否使用滚动区域 */
  scroll?: boolean
  params?: Omit<QDialogProps, 'modelValue'>
}

const { wrapperStyle, params } = withDefaults(defineProps<ZDialogProps>(), {
  cancelText: '取消',
  confirmText: '确认',
})
defineEmits(['update:modelValue', 'ok'])
</script>

<template>
  <q-dialog
    persistent
    :model-value="modelValue"
    v-bind="params"
    @update:model-value="val => $emit('update:modelValue', val)"
  >
    <q-card
      rounded="0!" flex="~ col gap6" py6
      :style="{
        minWidth: '460px',
        height: scroll ? 'calc(100vh - 100px)' : 'auto',
        ...wrapperStyle,
      }"
    >
      <header flex="~ row justify-between items-center" px6>
        <div flex="~ row">
          <div font-600 v-text="title" />
          <div text-grey-6 v-text="caption" />
        </div>

        <q-btn v-close-popup dense flat p0 h6 w6 min-h="auto!">
          <div i-mingcute:close-line text-grey-5 text-lg />
        </q-btn>
      </header>

      <div v-if="scroll" flex="~ col 1" h0 b-y-1>
        <q-scroll-area full px6>
          <div py6>
            <slot />
          </div>
        </q-scroll-area>
      </div>

      <div v-else px6>
        <slot />
      </div>

      <footer v-if="footer" flex="~ row justify-end gap6" px6 mt-4>
        <ZBtn
          v-close-popup
          min-w-28
          :label="cancelText"
          text-color="primary-1"
          :params="{
            outline: true,
          }"
        />
        <ZBtn
          v-close-popup
          min-w-28
          :label="confirmText"
          :disable="disableConfirm"
          @click="$emit('ok')"
        />
      </footer>
    </q-card>
  </q-dialog>
</template>
