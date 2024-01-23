<script lang="ts" setup>
import { isClient } from '@vueuse/core'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getRandomID } from 'zjf-utils'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

interface Props {
  modelValue?: string
  label?: string
  caption?: string
  placeholder?: string
  required?: boolean
  disable?: boolean
}

const props = defineProps<Props>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')

/** 蒙层 */
const modal = ref(false)

/** 编辑器实例 */
const editorRef = shallowRef<IDomEditor>()
/** 工具栏基本配置 */
const toolbarConfig: Partial<IToolbarConfig> = {
  modalAppendToBody: true,
}
/** 编辑器基本配置 */
const editorConfig = computed<Partial<IEditorConfig>>(() => ({
  placeholder: props.placeholder,
  readOnly: props.disable,
  MENU_CONF: {
    uploadImage: { customUpload },
    uploadVideo: { customUpload },
  }
}))

/**
 * 创建编辑器的回调
 */
function handleCreated(editor: IDomEditor) {
  editorRef.value = editor
  if (!isClient)
    return

  // 监听 `modalOrPanelShow` 和 `modalOrPanelHide` 自定义事件设置样式、蒙层
  editor.on(
    'modalOrPanelShow',
    (modalOrPanel) => {
      if (modalOrPanel.type !== 'modal')
        return

      const el = modalOrPanel.$elem[0] as HTMLElement
      el.classList.add('rich-text-model')
      modal.value = true
    }
  )
  editor.on(
    'modalOrPanelHide',
    () => {
      modal.value = false
    }
  )
}

/**
 * 自定义上传
 */
async function customUpload(file: File, insertFn: (url: string) => void) {
  const suffix = file.name.split('.').pop()
  const res = await uploadPublicFileApi({
    path: `cms/${getRandomID()}.${suffix}`,
  }, file)
  insertFn(`/api/file/public?path=${res}`)
}

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})
</script>

<template>
  <div class="rich-text" flex="~ col gap2">
    <div
      v-if="label"
      text="sm grey-8" font-500 flex="~ gap1"
    >
      <div v-if="required" text-alerts-error>*</div>
      {{ label }}
      <div
        v-if="caption"
        text-grey-6 font-400
        v-text="caption"
      />
    </div>
    <div rounded-2 b="1px grey-3" flex="~ col" bg-grey-1>
      <Toolbar
        :default-config="toolbarConfig"
        :editor="editorRef"
        b-b="1px grey-3"
      />
      <Editor
        v-model="value"
        :default-config="editorConfig"
        h="120!"
        @onCreated="handleCreated"
      />
    </div>

    <Teleport v-if="modal" to="body">
      <div absolute inset-0 bg="black/40" z-999 />
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.rich-text {
  --w-e-toolbar-color: var(--grey-8);
  --w-e-textarea-color: var(--grey-8);

  :deep(.w-e-toolbar) {
    background-color: transparent;
  }

  :deep(.w-e-full-screen-container) {
    border-radius: 12px;
  }

  :deep(.w-e-text-container) {
    background-color: transparent;

    .w-e-text-placeholder {
      font-size: 16px;
      line-height: 24px;
      color: var(--grey-5);
      font-style: normal;
      opacity: 0.7;
    }
  }
}
</style>

<style lang="scss">
body {
  > .w-e-modal.rich-text-model {
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    z-index: 1000;
  }
}
</style>
