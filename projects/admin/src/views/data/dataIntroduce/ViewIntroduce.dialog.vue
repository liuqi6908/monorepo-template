<script lang="ts" setup>
import type { IDataDirectory } from 'zjf-types'
import Intro from 'shared/views/data/intro/index.vue'
import ZDialog from 'shared/components/dialog/ZDialog.vue'

const props = defineProps<{
  id?: IDataDirectory['id']
}>()
defineEmits(['update:id'])

const zDialog = ref<InstanceType<typeof ZDialog>>()

const { dataList } = useDataRoot()

/** 获取根节点ID和数据库英文名 */
const params = computed(() => {
  const { id } = props
  const root = dataList.value?.find((v) => v.children?.find(d => d.id === id))
  if (root) {
    return {
      rootId: root.id,
      nameEn: root.children?.find(d => d.id === id)?.nameEN
    }
  }
})

/**
 * 滚动
 */
function scrollTo(
  offset: number,
  axis: 'vertical' | 'horizontal' = 'vertical',
  duration?: number,
) {
  zDialog.value?.scrollRef?.setScrollPosition(axis, offset, duration)
}
</script>

<template>
  <ZDialog
    ref="zDialog"
    :model-value="!!id"
    title="数据库介绍预览"
    scroll
    :params="{
      fullWidth: true,
      fullHeight: true,
    }"
    @update:model-value="$emit('update:id', undefined)"
  >
    <Intro
      v-if="params?.rootId && params?.nameEn"
      :root-id="params.rootId"
      :name-en="params.nameEn"
      :el="zDialog?.scrollRef"
      :scroll-to="scrollTo"
      :top="24"
      max-height="calc(100vh - 170px)"
    />
  </ZDialog>
</template>
