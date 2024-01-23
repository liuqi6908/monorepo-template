<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'

import ContentEditing from './ContentEditing.vue'

const { getComponentById } = useCms()
const {
  addComponent,
  addItem,
  pageData,
  editData,
  loading,
  isEdit,
  isItemList,
  pageConfig,
  selectComponent,
  initPage,
} = useEditCms()

/** 预览弹窗 */
const previewDialog = ref(false)

onBeforeMount(initPage)

/** 禁用保存 */
const disable = computed(() => JSON.stringify(pageData.value) === JSON.stringify(editData.value))

/**
 * 保存CMS内容
 */
async function saveCms() {
  if (disable.value)
    return

  loading.value = true
  try {
    await upsertCmsApi(pageConfig.value!.id, {
      json: editData.value
    })
    Notify.create({
      type: 'success',
      message: '保存成功',
    })
    pageData.value = cloneDeep(editData.value)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    flex="~ 1 col gap4" relative
    class="reactive-padding"
  >
    <ZLoading :value="loading" />

    <!-- 操作栏 -->
    <div flex="~ justify-between gap4 wrap">
      <div flex="~ gap4">
        <template v-if="isEdit">
          <ZBtn
            v-if="pageConfig?.component === true"
            label="新建组件"
            :disable="typeof addComponent === 'number'"
            @click="addComponent = editData.length"
          >
            <template #left>
              <div w5 h5 i-mingcute:add-line />
            </template>
          </ZBtn>
          <ZBtn
            v-if="isItemList"
            label="新建列表项"
            @click="addItem = selectComponent?.json?.length"
          >
            <template #left>
              <div w5 h5 i-mingcute:add-line />
            </template>
          </ZBtn>
        </template>
      </div>
      <div flex="~ gap4">
        <ZBtn
          label="刷新"
          text-color="primary-1"
          :params="{
            outline: true
          }"
          @click="initPage"
        >
          <template #left>
            <div w5 h5 i-mingcute:refresh-1-line />
          </template>
        </ZBtn>
        <ZBtn
          label="预览"
          text-color="primary-1"
          :params="{
            outline: true
          }"
          @click="previewDialog = true"
        >
          <template #left>
            <div w5 h5 i-mingcute:document-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="isEdit"
          label="保存"
          text-color="primary-1"
          :params="{
            outline: true
          }"
          :disable="JSON.stringify(pageData) === JSON.stringify(editData)"
          @click="saveCms"
        >
          <template #left>
            <div w5 h5 i-mingcute:save-2-line />
          </template>
        </ZBtn>
      </div>
    </div>

    <!-- 内容编辑区 -->
    <ContentEditing flex-1 />

    <!-- 预览 -->
    <ZDialog
      v-if="pageConfig"
      v-model="previewDialog"
      :title="pageConfig.label"
      scroll
      :params="{
        fullWidth: true,
        fullHeight: true,
      }"
    >
      <component
        v-if="pageConfig.component === true"
        :is="getComponentById(item.componentId)"
        v-for="(item, index) in editData"
        :key="index"
        :list="item.json"
        :mb="index < editData.length - 1 ? 20 : 0"
      />
      <component
        v-else
        :is="getComponentById(pageConfig.id)"
        :list="editData"
      />
    </ZDialog>
  </div>
</template>
