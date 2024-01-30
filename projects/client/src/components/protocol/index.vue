<script setup lang="ts">
export interface Protocol {
  label: string
  component: Component
}

interface ProtocolProps {
  modelValue: boolean
  list: Protocol[]
}

const props = defineProps<ProtocolProps>()
defineEmits(['update:modelValue'])

const value = useVModel(props)

/** 对话框 */
const dialog: boolean[] = reactive([])
</script>

<template>
  <div flex="~ items-start gap1" pl1>
    <q-checkbox
      v-model="value"
      dense
    />
    <div text="sm grey-5" font-400>
      <span>我已阅读并同意</span>
      <template v-for="(item, index) in list" :key="index">
        <span
          text-primary-1 cursor-pointer hover:underline="~ offset-1"
          @click="dialog[index] = true"
          v-text="`《${item.label}》`"
        />
        <span v-if="index < list.length - 1">、</span>
        <ZDialog
          v-model="dialog[index]"
          class="protocol-dialog"
          :title="item.label"
          :wrapper-style="{
            width: '800px',
            maxWidth: '800px',
          }"
          scroll
        >
          <component :is="item.component" />
        </ZDialog>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-checkbox {
  :deep() {
    .q-checkbox__inner {
      color: var(--grey-3);

      .q-checkbox__bg {
        border-radius: 50%;
        background-color: var(--grey-2);
      }
    }

    .q-checkbox__inner--truthy {
      .q-checkbox__bg {
        background-color: var(--primary-1);

        & > svg {
          transform: scale(0.8);
        }
      }
    }
  }
}
</style>
