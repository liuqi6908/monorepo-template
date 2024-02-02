<script lang="ts" setup>
import { isClient } from '@vueuse/core'
import type { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

interface Props {
  modelValue?: string
  disable?: boolean
}

const props = defineProps<Props>()
defineEmits(['update:modelValue'])

const ColorPickerComponent = shallowRef()
if (isClient) {
  import('vue3-colorpicker').then((module) => {
    ColorPickerComponent.value = module.ColorPicker
  })
}

const value = useVModel(props, 'modelValue')
const { byTranslate } = usePosition()
const { zoomRatio } = useSysConfig()

const colorPicker = ref<InstanceType<typeof ColorPicker>>()
/** 遮罩 */
const model = ref(false)

/**
 * 对 PickerRef 重新进行定位
 */
function calibrationPickerPosition() {
  nextTick(() => {
    const el = colorPicker.value?.pickerRef
    if (zoomRatio.value < 1 && el && el.style.display !== 'none') {
      const popper = el.getAttribute('data-popper-placement')
      if (popper === 'left') {
        byTranslate(el)
      }
      else if (popper === 'bottom') {
        model.value = true
        el.style.top = '50%'
        el.style.left = '50%'
        el.style.transform = 'translate(-50%, -50%)'
      }
    }
  })
}
</script>

<template>
  <div
    class="color-picker"
    :class="{ disable }"
    @click="calibrationPickerPosition"
  >
    <component
      ref="colorPicker"
      :is="ColorPickerComponent"
      v-model:pure-color="value"
      :gradient-color="value?.startsWith('rgb') ? '' : value"
      shape="circle"
      round-history
      use-type="both"
      @update:gradient-color="(val: any) => value = val"
    />

    <Teleport v-if="model && zoomRatio < 1" to="body">
      <div
        bg="black/40" z-999 absolute inset-0
        @click="model = false"
      />
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.color-picker {
  :deep(.vc-color-wrap) {
    margin: 0;
    width: 36px;
    height: 36px;
  }

  &.disable {
    :deep(.vc-color-wrap) {
      opacity: 0.7;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        cursor: not-allowed;
      }
    }
  }
}
</style>
