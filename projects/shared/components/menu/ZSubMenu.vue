<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

export interface ZSubMenuProps {
  modelValue?: string | number
  list?: {
    id: string | number
    label: string
    to?: string | {
      path?: string
      query?: Record<string, string | undefined>
    }
  }[]
}

const props = defineProps<ZSubMenuProps>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
</script>

<template>
  <q-tabs v-model="value" class="sub-menu">
    <q-route-tab
      v-for="item in list"
      :key="item.id"
      :name="item.id"
      :to="item.to"
      px5 opacity100
      @click="value = item.id"
    >
      <div
        text="base ellipsis" font-600
        max-w-full overflow-hidden
        v-text="item.label"
      />
    </q-route-tab>
  </q-tabs>
</template>

<style lang="scss" scoped>
.q-tabs {
  :deep(.q-tabs__content) {
    justify-content: start;
    flex-wrap: wrap;
    row-gap: 24px;
    flex: inherit;

    .q-tab {
      flex: inherit;
      max-width: 100%;

      &.q-tab--inactive {
        color: var(--grey-5);
      }

      .q-tab__content {
        height: 100%;
      }

      .q-tab__indicator {
        background: none;
        height: 4px;
        &::after {
          display: block;
          content: '';
          width: calc(100% / 3 - 12px);
          height: 100%;
          background: var(--primary-1);
          margin: auto;
        }
      }
    }
  }
}
</style>
