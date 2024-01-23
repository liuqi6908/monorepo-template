<script lang="ts" setup>
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

interface Props {
  modelValue?: string
  disable?: boolean
}

const props = defineProps<Props>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { byTranslate } = usePosition()
const { zoomRatio } = useSysConfig()

const colorPicker = ref<InstanceType<typeof ColorPicker>>()

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
    <ColorPicker
      ref="colorPicker"
      v-model:pure-color="value"
      :gradient-color="value?.startsWith('rgb') ? '' : value"
      shape="circle"
      round-history
      use-type="both"
      @update:gradient-color="val => value = val"
    />
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
