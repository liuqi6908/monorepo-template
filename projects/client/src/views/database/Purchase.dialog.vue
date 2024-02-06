<script lang="ts" setup>
import { Notify } from 'quasar'

const props = defineProps<{
  modelValue: boolean
}>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { query } = useRoute()
const { purchase, getPurchaseConfig } = useSysConfig()

/** 采购理由 */
const text = ref<string>('')
/** 禁用提交 */
const disable = computed(() => !query.tableId || !text.value || text.value.length > 200)

onBeforeMount(getPurchaseConfig)

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
    <div relative>
      <ZInput
        v-model="text"
        placeholder="请输入采购理由"
        type="textarea"
        :params="{
          maxlength: purchase?.works,
        }"
      />
      <div
        absolute bottom-0 right-2
        text="xs grey-6"
        v-text="`${text.length} / ${purchase?.works}`"
      />
    </div>
  </ZDialog>
</template>

<style lang="scss" scoped>
.z-input {
  :deep(.q-field) {
    background-color: var(--grey-2);
  }
}
</style>
