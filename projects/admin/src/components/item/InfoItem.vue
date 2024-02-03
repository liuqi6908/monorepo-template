<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { FILE_SIZE_UNITS } from 'zjf-utils'
import type { DESKTOP_REQUEST_DURATION_OPTION } from 'zjf-types'

import type { ZLabelProps } from 'shared/components/label/ZLabel.vue'

export interface InfoItemProps extends ZLabelProps {
  modelValue?: string
  type?: 'text' | 'image' | 'number' | 'fileSize' | 'fileSuffix' | 'option'
  text?: string | number
  unit?: string
  arr?: string[]
  option?: typeof DESKTOP_REQUEST_DURATION_OPTION
  isEdit?: boolean
  resetText?: string
}
export type UpdateParam = Pick<InfoItemProps, 'type' | 'text' | 'unit' | 'arr' | 'option'> & {
  file?: File
}

const props = withDefaults(defineProps<InfoItemProps>(), {
  type: 'text',
})
defineEmits<{
  (e: 'update', val: UpdateParam): void
  (e: 'reset'): void
}>()

/** 重置对话框 */
const resetDialog = ref(false)
/** 修改对话框 */
const updateDialog = ref(false)
/** 修改文本 */
const text = ref<string | number>()
/** 文件尺寸单位 */
const unit = ref<string>()
/** 文件后缀列表 */
const arr = ref<string[]>([])
/** 可选项配置列表 */
const option = ref<typeof DESKTOP_REQUEST_DURATION_OPTION>([])

watch(
  updateDialog,
  (newVal) => {
    if (newVal) {
      text.value = props.text || props.modelValue
      unit.value = props.unit
      arr.value = cloneDeep(props.arr) || []
      option.value = cloneDeep(props.option) || []
    }
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
      flex-1 w0
    />
    <div
      v-else
      flex="~ 1 col gap2" w0
    >
      <ZLabel v-bind="props" />
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
        @update:model-value="val => $emit('update', {
          type,
          file: val,
        })"
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
        || (type === 'fileSize' && (typeof text !== 'number' || text >= 1024))
        || (type === 'fileSuffix' && !arr.filter(Boolean).length)
        || (type === 'option' && !option.filter(v => v.label && v.value).length)
      "
      confirm-text="保存"
      footer
      @ok="$emit('update', {
        type,
        text,
        unit,
        arr,
        option,
      })"
    >
      <!-- 文本 -->
      <ZInput
        v-if="type === 'text'"
        v-model="text"
        :label="label"
        required
      />

      <!-- 数字 / 文件尺寸 -->
      <div
        v-else-if="type === 'number' || type === 'fileSize'"
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

      <!-- 文件名后缀 -->
      <div v-else-if="type === 'fileSuffix'" flex="~ col gap2">
        <ZLabel v-bind="props" required />
        <div flex="~ wrap" gap="x6 y3">
          <ZInput
            v-for="(_, i) in arr"
            :key="i"
            class="file-suffix"
            :model-value="arr[i]"
            :params="{
              maxlength: 10,
            }"
            w38
            @update:model-value="val => arr[i] = val"
          >
            <template #append>
              <div
                i-mingcute:close-line
                text-sm cursor-pointer hidden
                @click="arr.splice(i, 1)"
              />
            </template>
          </ZInput>
          <ZBtn
            class="w12"
            text-color="primary-1"
            :params="{
              outline: true
            }"
            :disable="arr.length > 20"
            size="big" w38
            @click="arr.push('')"
          >
            <div text-lg i-mingcute:add-line />
          </ZBtn>
        </div>
      </div>

      <!-- 可选项配置 -->
      <div v-else-if="type === 'option'" flex="~ col gap2">
        <ZLabel v-bind="props" required />
        <div flex="~ col gap3">
          <div
            v-for="(_, i) in option"
            :key="i"
            flex="~ gap6"
          >
            <ZInput
              class="option"
              label="标签"
              :model-value="option[i].label"
              :params="{
                maxlength: 10,
              }"
              flex-3 w0
              @update:model-value="val => option[i].label = val"
            >
              <template #append>
                <div
                  i-mingcute:close-line
                  text-sm cursor-pointer hidden
                  @click="option.splice(i, 1)"
                />
              </template>
            </ZInput>
            <ZInput
              label="值"
              :model-value="option[i].value"
              type="number"
              flex-2 w0
              @update:model-value="(val) => {
                const num = Math.floor(Number.parseFloat(val))
                if (Number.isNaN(num) || num <= 0)
                  option[i].value = 1
                else if (num > 99999)
                  option[i].value = 99999
                else
                  option[i].value = num
              }"
            />
          </div>
          <ZBtn
            text-color="primary-1"
            :params="{
              outline: true
            }"
            :disable="option.length > 10"
            size="big"
            @click="option.push({
              label: '',
              value: 1,
            })"
          >
            <div text-lg i-mingcute:add-line />
          </ZBtn>
        </div>
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

.z-input {
  &.file-suffix, &.option {
    &:hover {
      :deep(.q-field__append) {
        > div {
          display: block;
        }
      }
    }
  }
}
</style>
