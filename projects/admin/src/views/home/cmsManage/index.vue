<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'

import ContentEditing from './ContentEditing.vue'

const { active } = useMenu()
const { byAbsolute } = usePosition()
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
/** 首页问答区预览弹窗 */
const questionPreviewDialog = ref(false)
/** 预览菜单 */
const previewMenu = ref(false)

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
  <div flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <!-- 操作栏 -->
    <div flex="~ justify-between wrap" gap="x4 y2">
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
          v-if="active !== 'question'"
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
        <div v-else rounded-2>
          <ZBtn
            label="预览"
            text-color="primary-1"
            :params="{
              outline: true,
            }"
          >
            <template #left>
              <div w5 h5 i-mingcute:document-line />
            </template>
            <template #icon>
              <div
                w5 h5 i-mingcute:down-line
                transition
                :style="{
                  transform: previewMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                }"
              />
            </template>
          </ZBtn>
          <q-menu
            v-model="previewMenu"
            id="preview-question-menu"
            class="more-menu"
            @before-show="byAbsolute('preview-question-menu', [0, 6])"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                w="106px!"
                @click="questionPreviewDialog = true"
              >
                <q-item-section>
                  首页问答区
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                w="106px!"
                @click="previewDialog = true"
              >
                <q-item-section>
                  问答页
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
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

    <!-- 首页问答区预览 -->
    <ZDialog
      v-if="pageConfig"
      v-model="questionPreviewDialog"
      title="首页问答区"
      scroll
      :params="{
        fullWidth: true,
        fullHeight: true,
      }"
    >
      <component
        :is="getComponentById('A0006')"
        :list="
          editData?.filter((_, i) => i < 4)
        "
      />
    </ZDialog>
  </div>
</template>
