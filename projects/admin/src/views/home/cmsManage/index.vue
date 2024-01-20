<script lang="ts" setup>
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType } from 'zjf-types'
import { hasIntersection, getRandomID } from 'zjf-utils'
import type { CmsConfig, CmsJson } from 'shared/types/cms.interface'

import addIcon from '~/assets/icons/other/add.svg?raw'
import refreshIcon from '~/assets/icons/other/refresh.svg?raw'
import documentIcon from '~/assets/icons/other/document.svg?raw'
import saveIcon from '~/assets/icons/other/save.svg?raw'

import ContentEditing from './ContentEditing.vue'

const props = defineProps<{
  config: CmsConfig
}>()

const { adminRole } = useUser()
const { getCms, getComponentById } = useCms()

/** 是否可以编辑 */
const isEdit = computed(() => hasIntersection(adminRole.value ?? [], [
  PermissionType.CMS_CREATE,
  PermissionType.CMS_UPDATE,
]))

/** 加载中 */
const loading = ref(false)
/** 页面原始数据 */
const pageData = ref<CmsJson[]>([])
/** 可编辑数据 */
const editData = ref<CmsJson[]>([])

/** 预览弹窗 */
const previewDialog = ref(false)
/** 添加组件 */
const addComponent = ref(false)

onBeforeMount(getPageCms)

/**
 * 获取页面Cms内容
 */
async function getPageCms() {
  loading.value = true
  try {
    pageData.value = await getCms(props.config.id) ?? []
    editData.value = cloneDeep(pageData.value)
  }
  finally {
    loading.value = false
  }
}

/**
 * 新建
 */
function addItem() {
  const { component } = props.config
  if (component === true) {
    addComponent.value = true
  }
  else {
    const param = CMS_COMPONENTS[component].param
    if (param.includes('list')) {
      const obj: any = {
        id: getRandomID(),
      }
      for (const key of param) {
        if (key !== 'list')
          obj[key] = ''
      }
      editData.value.push(obj)
    }
  }
}

/**
 * 保存CMS内容
 */
async function saveCms() {
  loading.value = true
  try {
    await upsertCmsApi(props.config.id, {
      json: editData.value
    })
    Notify.create({
      type: 'success',
      message: '保存成功',
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div flex="~ 1 col gap4" p="y4 x10" relative>
    <ZLoading :value="loading" />

    <!-- 操作栏 -->
    <div flex>
      <ZBtn
        v-if="isEdit && (config.component === true || CMS_COMPONENTS[config.component].param.includes('list'))"
        label="新建"
        @click="addItem"
      >
        <template #left>
          <div v-html="addIcon" />
        </template>
      </ZBtn>
      <div flex="~ gap4" ml-auto>
        <ZBtn
          label="刷新"
          text-color="primary-1"
          :params="{
            outline: true
          }"
          @click="getPageCms"
        >
          <template #left>
            <div v-html="refreshIcon" />
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
            <div v-html="documentIcon" />
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
            <div v-html="saveIcon" />
          </template>
        </ZBtn>
      </div>
    </div>

    <!-- 内容编辑区 -->
    <ContentEditing flex-1 />

    <!-- 预览 -->
    <ZDialog
      v-model="previewDialog"
      :title="config.label"
      :params="{
        fullWidth: true,
        fullHeight: true,
      }"
    >
      <component
        v-if="config.component === true"
        :is="getComponentById(item.componentId)"
        v-for="(item, index) in editData"
        :key="index"
        :list="item.json"
        :mb="index < editData.length - 1 ? 20 : 0"
      />
      <component
        v-else
        :is="getComponentById(config.id)"
        :list="editData"
      />
    </ZDialog>
  </div>
</template>
