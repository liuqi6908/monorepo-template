<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

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
const emits = defineEmits(['update:modelValue'])

const $router = useRouter()

const value = computed({
  get() {
    return props.modelValue
  },
  set(newVal) {
    if (props.modelValue !== newVal) {
      emits('update:modelValue', newVal)
      const item = props.list?.find(v => v.id === newVal)
      if (item?.to)
        $router.push(item.to)
    }
  }
})
</script>

<template>
  <q-tabs v-model="value" class="sub-menu">
    <q-tab
      v-for="{ id, label } in list"
      :key="id"
      :name="id"
      px5 opacity100
    >
      <div
        text="base ellipsis" font-600
        max-w-full overflow-hidden
        v-text="label"
      />
    </q-tab>
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
