<script lang="ts" setup>
import { Notify } from 'quasar'

const props = defineProps<{
  modelValue: boolean
}>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { query } = useRoute()

/** 采购理由 */
const text = ref<string>('')
/** 禁用提交 */
const disable = computed(() => !query.tableId || !text.value || text.value.length > 200)

/**
 * 申请采购
 */
async function applyPurchase() {
  if (disable.value)
    return
  await createDataSuggestApi(query.tableId as string, {
    reason: text.value!
  })
  Notify.create({
    message: '建议采购成功',
    type: 'success',
  })
}
</script>

<template>
  <ZDialog
    v-model="value"
    title="采购理由"
    footer
    :disableConfirm="disable"
    :wrapperStyle="{
      width: '618px'
    }"
    @ok="applyPurchase"
  >
    <ZInput
      v-model="text"
      placeholder="请输入采购理由"
      :params="{
        type: 'textarea'
      }"
    />
  </ZDialog>
</template>

<style lang="scss" scoped>
.z-input {
  :deep(.q-field) {
    background-color: var(--grey-2);
  }
}
</style>
