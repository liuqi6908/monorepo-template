<script lang="ts" setup>
import { getRandomID } from 'zjf-utils'
import ComponentList from './ComponentList.vue'
import AddComponent from './AddComponent.vue'
import ItemList from './ItemList.vue'
import EditItem from './EditItem.vue'

const { addComponent, addItem, componentParams, pageConfig, selectComponent, selectItem, isItemList, editData } = useEditCms()

/** 空状态提示信息 */
const emptyHint = computed(() => {
  if (pageConfig.value?.component === true && !editData.value.length) {
    return {
      label: '暂无组件',
      captions: '请点击左上方【新建组件】按钮，新建组件',
    }
  }
  else if (isItemList.value && !selectComponent.value?.json?.length) {
    return {
      label: '暂无列表项',
      captions: '请点击左上方【新建列表项】按钮，新建列表项',
    }
  }
})

// 对 addItem 监听，添加列表项
watch(
  addItem,
  (newVal) => {
    if (typeof newVal === 'number' && componentParams.value?.includes('list')) {
      const item: any = {
        id: getRandomID()
      }
      for (const key of componentParams.value) {
        item[key] = ''
      }
      selectComponent.value?.json?.splice(newVal, 0, item)
      selectItem.value = item
    }
    addItem.value = undefined
  }
)
</script>

<template>
  <div flex="~ gap2">
    <!-- 组件列表 -->
    <ComponentList v-if="pageConfig?.component === true && editData.length" />

    <!-- 添加组件 -->
    <AddComponent v-if="typeof addComponent === 'number'" flex-1 />

    <template v-else>
      <!-- 列表项 -->
      <ItemList v-if="isItemList && selectComponent?.json?.length" />

      <!-- 空状态 -->
      <Empty
        v-if="emptyHint"
        class="card" flex-1 w0
        icon="item"
        v-bind="emptyHint"
      />

      <!-- 编辑列表项 -->
      <EditItem v-else :key="selectItem?.id" flex-1 w0 />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.card {
  height: 100%;
  background-color: var(--grey-1);
  border-radius: 12px;

  :deep(.q-scrollarea__content) {
    width: 100%;
  }
}
</style>
