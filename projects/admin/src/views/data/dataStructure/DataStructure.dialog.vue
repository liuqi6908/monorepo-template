<script lang="ts" setup>
import ZDialog from 'shared/components/dialog/ZDialog.vue'
import ZEmpty from 'shared/views/data/Empty.vue'
import Root from 'shared/views/data/database/index.vue'
import type { ZMenuProps } from 'shared/components/menu/ZMenu.vue'

const props = defineProps<{
  modelValue?: boolean
}>()
defineEmits(['update:modelValue'])

const zDialog = ref<InstanceType<typeof ZDialog>>()

const { selectedId } = useDataRoot()
const { rootList, rootId, getRootList } = useDatabase()
const { query } = useRoute()
const $router = useRouter()

/** 加载中 */
const loading = ref(false)

watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal) {
      if (!selectedId.value) {
        loading.value = true
        rootId.value = undefined
        try {
          await getRootList()
          if (rootList.value?.length)
            rootId.value = rootList.value.find(v => v.id === query.rootId)?.id || rootList.value[0].id
        }
        finally {
          loading.value = false
        }
      }
      else {
        rootId.value = selectedId.value
      }
      if (rootId.value && rootId.value !== query.rootId)
        $router.push({ query: { rootId: rootId.value } })
    }
  },
  {
    immediate: true
  }
)

/** 数据大类菜单 */
const menu = computed<ZMenuProps['list']>(() => {
  return rootList.value?.map((item) => {
    const { id, nameZH } = item
    return {
      id,
      label: nameZH,
      to: {
        query: {
          rootId: id,
        },
      },
    }
  })
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

watch(rootId, () => scrollTo(0))
</script>

<template>
  <ZDialog
    ref="zDialog"
    class="data-structure-dialog"
    :model-value="modelValue"
    title="查看数据结构"
    scroll
    :params="{
      fullWidth: true,
      fullHeight: true,
    }"
    :loading="loading"
    @update:model-value="() => {
      $emit('update:modelValue', false)
      selectedId = undefined
      $router.replace({ query: undefined })
    }"
  >
    <div>
      <ZEmpty v-if="!selectedId && !menu?.length" icon="database" />
      <div v-else w-limited-1 flex="~ gap4" sm="gap6" lg="gap8" xl="gap10">
        <div v-if="!selectedId" pt10>
          <ZMenu
            v-model="rootId" :list="menu" sticky
            top-10
          />
        </div>
        <Root
          :el="zDialog?.scrollRef"
          :scroll-to="scrollTo"
          :height="0"
          :distance="0"
          :key="rootId" flex-1 w0
        />
      </div>
    </div>
  </ZDialog>
</template>

<style lang="scss">
.data-structure-dialog {
  .z-dialog__scrollarea {
    > .q-scrollarea__container > .q-scrollarea__content {
      > div {
        padding-top: 0;
      }
    }
  }
}
</style>
