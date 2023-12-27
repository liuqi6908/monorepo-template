<script lang="ts" setup>
import { Notify } from 'quasar'

defineProps<{
  modelValue: boolean
}>()
defineEmits(['update:modelValue'])

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
    :model-value="modelValue"
    title="采购理由"
    footer
    :disableConfirm="disable"
    :wrapperStyle="{
      width: '618px'
    }"
    @ok="applyPurchase"
    @update:model-value="val => $emit('update:modelValue', val)"
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
