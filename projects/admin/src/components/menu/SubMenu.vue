<script lang="ts" setup>
export interface SubMenuProps {
  modelValue?: string | number
  list?: {
    id: string | number
    label: string
  }[]
}

const props = defineProps<SubMenuProps>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
</script>

<template>
  <q-tabs v-model="value" class="sub-menu">
    <q-tab
      v-for="item in list"
      :key="item.id"
      :name="item.id"
      no-caps :ripple="false"
      @click="value = item.id"
    >
      <div
        text-base truncate font-600 max-w-full
        v-text="item.label"
      />
    </q-tab>
  </q-tabs>
</template>

<style lang="scss" scoped>
.q-tabs {
  :deep(.q-tabs__content) {
    justify-content: start;
    flex-wrap: wrap;
    gap: 8px 24px;
    flex: inherit;

    .q-tab {
      flex: inherit;
      max-width: 100%;
      padding: 0;
      opacity: 1;
      min-height: auto;
      height: 38px;

      .q-focus-helper {
        display: none;
      }

      &.q-tab--inactive {
        color: var(--grey-5);
      }

      .q-tab__content {
        height: auto;
        align-self: start;
        padding: 0;
      }

      .q-tab__indicator {
        background: none;
        height: 6px;
        &::after {
          display: block;
          content: '';
          width: 50%;
          height: 100%;
          background: var(--primary-1);
          margin: auto;
          border-radius: 16px;
        }
      }
    }
  }
}
</style>
