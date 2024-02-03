<script lang="ts" setup>
import { isClient } from '@vueuse/core'
import { browser, isImage } from 'zjf-utils'
import type { IDesktopQueue } from 'zjf-types'

interface Props {
  userId?: IDesktopQueue['userId']
  attachments?: IDesktopQueue['attachments']
}

const props = defineProps<Props>()
defineEmits(['closeDialog'])

const vPreview = shallowRef()
if (isClient) {
  import('vue3-image-preview').then((module) => {
    vPreview.value = module.vPreview
  })
}

/** 图片文件 */
const imageFiles = computed(() => props.attachments?.filter(isImage))
/** 其他文件 */
const otherFiles = computed(() => props.attachments?.filter(v => !isImage(v)))
</script>

<template>
  <ZDialog
    :model-value="!!userId && !!attachments?.length"
    title="查看申请材料"
    @update:model-value="$emit('closeDialog')"
  >
    <div flex="~ col gap8">
      <div v-if="imageFiles?.length" flex="~ col gap6">
        <SubLabel label="图片附件" />
        <div flex="~ gap2 wrap">
          <img
            v-for="(filename, index) in imageFiles"
            v-preview:name="userId"
            :key="index"
            :src="getDesktopRequestAttachmentsUrl(userId!, filename)"
            w16 h16 rounded-2 cursor-pointer
          >
        </div>
      </div>
      <div v-if="otherFiles?.length" flex="~ col gap6">
        <SubLabel label="其他附件" />
        <div flex="~ col gap3">
          <div
            v-for="(filename, index) in otherFiles"
            :key="index"
            flex="~ items-center self-start gap2"
            max-w-full cursor-pointer
            hover:text-primary-1
            @click="browser.downloadUrl(getDesktopRequestAttachmentsUrl(userId!, filename), filename)"
          >
            <div w5 h5 i-mingcute:document-2-line />
            <div
              truncate
              style="max-width: calc(100% - 28px)"
              v-text="filename"
            />
          </div>
        </div>
      </div>
    </div>
  </ZDialog>
</template>
