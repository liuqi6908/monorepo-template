<script lang="ts" setup>
import moreIcon from '~/assets/icons/other/more.svg?raw'

interface ListProps {
  modelValue: any
  list?: any[]
  labelText?: string
  valueText?: string
  isEdit?: boolean
}

const props = withDefaults(defineProps<ListProps>(), {
  labelText: 'label',
  valueText: 'value'
})
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
</script>

<template>
  <q-scroll-area rounded-3 bg-grey-1>
    <div p4>
      <div flex="~ col gap4">
        <div
          v-for="(li, index) in list"
          :key="index"
          :class="{
            active: modelValue === li[valueText]
          }"
          p="y3 x2" rounded-2
          hover:bg-grey-2 flex="~ justify-between items-center gap2"
          @click="value = li[valueText]"
        >
          <div
            truncate text-sm font-500
            v-text="li[labelText]"
          />
          <div
            v-if="isEdit"
            cursor-pointer rounded-1
            hover="bg-black/10"
          >
            <div v-html="moreIcon" />
            <slot />
          </div>
        </div>
      </div>
    </div>
  </q-scroll-area>
</template>

<style lang="scss" scoped>
.active {
  background-color: var(--primary-1-bg);

  > div:first-child {
    color: var(--primary-1);
  }
}
</style>
