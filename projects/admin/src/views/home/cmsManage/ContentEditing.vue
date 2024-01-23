<script lang="ts" setup>
import ComponentList from './ComponentList.vue'
import AddComponent from './AddComponent.vue'
import ItemList from './ItemList.vue'
import EditItem from './EditItem.vue'

const { addComponent, pageConfig, selectComponent, selectItem, isItemList } = useEditCms()

/** 空状态提示信息 */
const emptyHint = computed(() => {
  if (pageConfig.value?.component === true && !selectComponent.value) {
    return {
      label: '未选择组件',
      captions: '请在左侧列表选择组件，进行编辑',
    }
  }
  else if (isItemList.value && !selectItem.value) {
    return {
      label: '未选择列表项',
      captions: '请在左侧列表选择列表项，进行编辑',
    }
  }
})
</script>

<template>
  <div flex="~ gap2">
    <!-- 组件列表 -->
    <ComponentList v-if="pageConfig?.component === true" />

    <!-- 添加组件 -->
    <AddComponent v-if="typeof addComponent === 'number'" flex-1 />

    <template v-else>
      <!-- 列表项 -->
      <ItemList v-if="isItemList" />

      <!-- 空状态 -->
      <Empty
        v-if="emptyHint"
        class="card" flex-1 w0
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
