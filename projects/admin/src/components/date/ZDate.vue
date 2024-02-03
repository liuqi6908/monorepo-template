<script lang="ts" setup>
import type { QDateProps } from 'quasar'
import type { ZInputProps } from 'shared/components/input/ZInput.vue'

interface ZDateProp {
  modelValue?: any
  range?: boolean
  inputParams?: Omit<ZInputProps, 'modelValue'>
  resetBtn?: boolean
  dateParams?: Omit<QDateProps, 'modelValue' | 'range'>
}

const props = withDefaults(
  defineProps<ZDateProp>(),
  {
    resetBtn: true,
  }
)
defineEmits(['update:modelValue'])

/** 日期 */
const value = ref()
/** 显示日期选择器 */
const isShowDate = ref(false)

watch(
  isShowDate,
  (newVal) => {
    if (newVal) {
      const { range, modelValue } = props
      if (range && modelValue?.from === modelValue?.to)
        value.value = modelValue?.from
      else
        value.value = modelValue
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <ZInput
    :model-value="
      range && typeof modelValue !== 'string' && modelValue
        ? `${modelValue.from} 至 ${modelValue.to}`
        : modelValue
    "
    :placeholder="range ? '请选择日期范围' : '请选择日期'"
    :params="{
      readonly: true,
    }"
    v-bind="inputParams"
  >
    <template #prepend>
      <div
        w5 h5 cursor-pointer
        hover:text-grey-8
        i-carbon:calendar
      >
        <q-popup-proxy
          v-model="isShowDate"
          :offset="[120, 12]"
          :breakpoint="APP_MIN_WIDTH"
        >
          <q-date
            v-model="value"
            :range="range"
            today-btn
            mask="YYYY-MM-DD"
            v-bind="dateParams"
          >
            <div flex="~ justify-end gap3">
              <ZBtn
                v-if="resetBtn"
                label="重置"
                size="small"
                text-color="primary-1"
                :params="{
                  outline: true,
                }"
                @click="() => {
                  isShowDate = false
                  $emit('update:modelValue', undefined)
                }"
              />
              <ZBtn
                label="确定"
                size="small"
                @click="() => {
                  isShowDate = false
                  if (range && typeof value === 'string') {
                    $emit(
                      'update:modelValue',
                      {
                        from: value,
                        to: value,
                      }
                    )
                  }
                  else {
                    $emit('update:modelValue', value)
                  }
                }"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </div>
    </template>
  </ZInput>
</template>
