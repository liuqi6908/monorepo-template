<script lang="ts" setup>
import { browser, getRandomID } from 'zjf-utils'

const {
  loading,
  selectItem,
  componentParams,
  isEdit,
} = useEditCms()

/** 样式的可选项 */
const styleOptions = [
  { label: '样式一', value: '1' },
  { label: '样式二', value: '2' },
]

const img = ref<File>()
const svg = ref<File>()

// 上传图片
watch(
  img,
  async (newVal) => {
    loading.value = true
    try {
      if (newVal && selectItem.value) {
        const suffix = newVal.name.split('.').pop()
        const res = await uploadPublicFileApi({
          path: `cms/${getRandomID()}.${suffix}`,
        }, newVal)
        selectItem.value.img = `/api/file/public?path=${res}`
      }
    }
    finally {
      loading.value = false
      img.value = undefined
    }
  }
)

// 上传svg
watch(
  svg,
  async (newVal) => {
    try {
      if (newVal && selectItem.value) {
        const text = await browser.readFile(newVal) as string
        selectItem.value.svg = text
      }
    }
    finally {
      svg.value = undefined
    }
  }
)

/**
 * 替换svg的fill和stroke属性
 */
const fillReplacedSvg = computed(() => {
  return selectItem.value?.svg?.replace(/fill=".*?"/g, 'fill="currentColor"')
    .replace(/stroke=".*?"/g, 'stroke="currentColor"')
})
</script>

<template>
  <q-scroll-area v-if="selectItem" class="card" overflow-hidden>
    <div p4 flex="~ col gap6">
      <!-- Title -->
      <ZInput
        v-if="componentParams?.includes('title')"
        v-model="selectItem.title"
        label="标题"
        placeholder="请输入标题"
        :params="{
          readonly: !isEdit,
        }"
      />
      <!-- Style -->
      <ZSelect
        v-if="componentParams?.includes('style')"
        :model-value="styleOptions.find(v => v.value === selectItem!.style)"
        :options="styleOptions"
        label="样式"
        placeholder="请选择样式"
        @update:model-value="val => selectItem!.style = val.value"
      />
      <!-- Img -->
      <div
        v-if="componentParams?.includes('img')"
        flex="~ col gap2"
      >
        <ZUpload
          v-model="img"
          label="图片"
          type="image"
          accept="image/*"
          :disable="!isEdit"
        >
          <ZBtn :disable="!isEdit" label="上传图片">
            <template #left>
              <div w5 h5 i-mingcute:pic-2-line />
            </template>
          </ZBtn>
        </ZUpload>
        <div
          v-if="selectItem.img"
          class="upload-img"
          w35 h24 relative
          rounded-2 overflow-hidden
        >
          <img :src="selectItem.img" full />
          <div absolute inset-0 z-1 hidden bg="black/30" />
          <div
            v-if="isEdit"
            w6 h6 cursor-pointer
            flex-center rounded-1
            absolute top-1 right-1
            bg-white-3 z-2 hidden
            @click="selectItem.img = ''"
          >
            <div w5 h5 text-grey-1 i-mingcute:close-line />
          </div>
        </div>
      </div>
      <!-- Svg -->
      <div
        v-if="componentParams?.includes('svg')"
        flex="~ col gap2"
      >
        <ZUpload
          v-model="svg"
          label="图标"
          accept=".svg"
          :disable="!isEdit"
        >
          <ZBtn :disable="!isEdit" label="上传SVG">
            <template #left>
              <div w5 h5 i-mingcute:file-code-line />
            </template>
          </ZBtn>
        </ZUpload>
        <div
          v-if="selectItem.svg"
          class="upload-svg"
          w20 h20 relative
          rounded-2 overflow-hidden
        >
          <div class="svg" text-primary-1 full v-html="fillReplacedSvg" />
          <div absolute inset-0 z-1 hidden bg="black/30" />
          <div
            v-if="isEdit"
            w6 h6 cursor-pointer
            flex-center rounded-1
            absolute top-1 right-1
            bg-white-3 z-2 hidden
            @click="selectItem.svg = ''"
          >
            <div w5 h5 text-grey-1 i-mingcute:close-line />
          </div>
        </div>
      </div>
      <!-- Color -->
      <div
        v-if="componentParams?.includes('color')"
        flex="~ items-end gap4"
      >
        <ZInput
          v-model="selectItem.color"
          class="color-input"
          label="颜色"
          placeholder="请选择颜色"
          :params="{
            readonly: true,
          }"
          flex-1
        >
          <template #append>
            <div
              i-mingcute:close-line
              text-sm cursor-pointer hidden
              @click="selectItem.color = ''"
            />
          </template>
        </ZInput>
        <ColorPicker v-model="selectItem.color" :disable="!isEdit" mb1.5 />
      </div>
      <!-- Mask -->
      <div
        v-if="componentParams?.includes('mask')"
        flex="~ items-end gap4"
      >
        <ZInput
          v-model="selectItem.mask"
          class="mask-input"
          label="遮罩"
          placeholder="请选择遮罩图层"
          :params="{
            readonly: true,
          }"
          flex-1
        >
          <template #append>
            <div
              i-mingcute:close-line
              text-sm cursor-pointer hidden
              @click="selectItem.mask = ''"
            />
          </template>
        </ZInput>
        <ColorPicker
          v-model="selectItem.mask"
          :disable="!isEdit"
          gradient-color
          mb1.5
        />
      </div>
      <!-- RichText -->
      <RichText
        v-if="componentParams?.includes('richText')"
        v-model="selectItem.richText"
        label="富文本"
        placeholder="请输入文本内容"
        :disable="!isEdit"
      />
    </div>
  </q-scroll-area>
</template>

<style lang="scss" scoped>
.upload-img, .upload-svg {
  &:hover {
    > div:not(.svg) {
      display: flex;
    }
  }
}

.upload-svg {
  > .svg {
    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
}

.z-input {
  &.color-input, &.mask-input {
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
