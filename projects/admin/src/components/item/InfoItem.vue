<script lang="ts" setup>
import { FILE_SIZE_UNITS } from 'zjf-utils'

export interface InfoItemProps {
  label?: string
  caption?: string
  modelValue?: string
  type?: 'text' | 'image' | 'number' | 'fileSize'
  text?: string | number
  unit?: string
  isEdit?: boolean
  resetText?: string
}

const props = withDefaults(defineProps<InfoItemProps>(), {
  type: 'text',
})
defineEmits(['update:modelValue', 'reset'])

/** 重置对话框 */
const resetDialog = ref(false)
/** 修改对话框 */
const updateDialog = ref(false)
/** 修改文本 */
const text = ref<string | number>()
/** 单位 */
const unit = ref<string>()

watch(
  props,
  (newVal) => {
    text.value = newVal.text || newVal.modelValue
    unit.value = newVal.unit
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div flex="~ items-end gap10">
    <!-- 信息 -->
    <ReadonlyInput
      v-if="type !== 'image'"
      :model-value="modelValue"
      :label="label"
      :caption="caption"
      flex-1
    />
    <div
      v-else
      flex="~ 1 col gap2" w0
    >
      <div
        v-if="label"
        text="sm grey-8" font-500 flex="~ gap1"
        whitespace-nowrap
      >
        {{ label }}
        <div
          v-if="caption"
          text-grey-6 font-400
          v-text="caption"
        />
      </div>
      <div w24 h24 rounded-2 b="1px grey-3" overflow-hidden>
        <img :src="modelValue" full />
      </div>
    </div>

    <!-- 操作 -->
    <div
      flex="~ gap6" class="btn-container"
      :class="{ disable: !isEdit }"
      select-none
    >
      <div
        class="btn"
        @click="() => {
          if (isEdit)
            resetDialog = true
        }"
      >
        重置
      </div>
      <div
        v-if="type !== 'image'"
        class="btn"
        @click="() => {
          if (isEdit)
            updateDialog = true
        }"
      >
        修改
      </div>
      <ZUpload
        v-else
        accept=".png,.jpg,.jpeg"
        :max-file-size="100 * 1024"
        :disable="!isEdit"
        :hintMessage="{
          accept: '只能上传 png、jpg 格式文件',
          size: '图片大小不能超过 100KB'
        }"
        @update:model-value="val => $emit('update:modelValue', val)"
      >
        <div class="btn">
          修改
        </div>
      </ZUpload>
    </div>

    <!-- 重置对话框 -->
    <ZDialog
      v-model="resetDialog"
      title="重置"
      footer
      @ok="$emit('reset')"
    >
      该操作将重置 {{ label }} {{ resetText }}，是否继续？
    </ZDialog>

    <!-- 修改对话框 -->
    <ZDialog
      v-model="updateDialog"
      title="修改"
      :disable-confirm="
        (typeof text !== 'number' && !text)
        || (typeof text === 'number' && text < 0)
        || (type === 'fileSize'
          && (typeof text !== 'number' || text >= 1024)
        )
      "
      confirm-text="保存"
      footer
      @ok="$emit('update:modelValue', text, unit)"
    >
      <ZInput
        v-if="type === 'text'"
        v-model="text"
        :label="label"
        required
      />
      <div
        v-if="type === 'number' || type === 'fileSize'"
        flex="~ gap10"
      >
        <ZInput
          v-model.number="text"
          :label="label"
          type="number"
          required flex-1
        />
        <ZSelect
          v-if="type === 'fileSize'"
          v-model="unit"
          label="单位"
          :options="FILE_SIZE_UNITS.filter((_, i) => i < 4)"
          w26
        />
      </div>
    </ZDialog>
  </div>
</template>

<style lang="scss" scoped>
.btn-container {
  position: relative;

  .btn {
    padding: 14px 0;
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--primary-1);
  }

  &.disable .btn {
    cursor: not-allowed;
    opacity: 0.7;
  }
}
</style>
