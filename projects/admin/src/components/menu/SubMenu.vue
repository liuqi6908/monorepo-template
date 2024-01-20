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
  <q-tabs
    v-model="value"
    class="sub-menu"
    bg-grey-1 p="y2 x10" b-b="1px grey-3"
  >
    <q-tab
      v-for="item in list"
      :key="item.id"
      :name="item.id"
      opacity100 p="y3 x6" flex-1
      rounded-2
      @click="value = item.id"
    >
      <div
        text-base font-600
        v-text="item.label"
      />
    </q-tab>
  </q-tabs>
</template>

<style lang="scss" scoped>
.q-tabs {
  :deep() {
    .q-tabs__content {
      .q-tab {
        &.q-tab--inactive {
          color: var(--grey-5);
        }

        .q-tab__content {
          padding: 0;
        }

        &:hover .q-focus-helper {
          &::after {
            opacity: 0.6;
          }
        }

        .q-tab__indicator {
          display: none;
        }
      }
    }

    .q-tabs__arrow {
      font-size: 16px;
    }
  }
}
</style>
