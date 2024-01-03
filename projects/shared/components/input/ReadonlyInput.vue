<script setup lang="ts">
export interface ReadonlyInputProps {
  modelValue?: string
  label?: string
  caption?: string
  required?: boolean
}

defineProps<ReadonlyInputProps>()
</script>

<template>
  <div class="readonly-input" flex="~ col gap2">
    <div
      v-if="label"
      text="sm grey-8" font-500 flex="~ gap1"
    >
      <div v-if="required" text-alert-error>*</div>
      {{ label }}
      <div
        v-if="caption"
        text-grey-6 font-400
        v-text="caption"
      />
    </div>
    <div
      p="y2 x3" b="1px grey-3" h12 flex="~ items-center"
      bg-grey-2 text="base grey-4" font-400 truncate
      v-text="modelValue"
    />
  </div>
</template>

<style lang="scss">
.z-input {
  .q-field {
    &.q-textarea {
      background-color: var(--grey-2);
      &.q-field--dark {
        background-color: transparent;
      }

      .q-field__control {
        padding-right: 0;

        textarea {
          min-height: 48px;
          max-height: 300px;
        }
      }
    }
  }
}
</style>