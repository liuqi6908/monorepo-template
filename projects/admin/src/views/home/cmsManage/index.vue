<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { PermissionType } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import type { CmsConfig, CmsJson } from 'shared/types/cms.interface'
import addIcon from '~/assets/icons/other/add.svg?raw'
import refreshIcon from '~/assets/icons/other/refresh.svg?raw'
import documentIcon from '~/assets/icons/other/document.svg?raw'
import saveIcon from '~/assets/icons/other/save.svg?raw'

const props = defineProps<{
  config: CmsConfig
}>()

const { adminRole } = useUser()
const { getCms } = useCms()

/** 是否可以编辑 */
const isEdit = computed(() => hasIntersection(adminRole.value ?? [], [
  PermissionType.CMS_CREATE,
  PermissionType.CMS_UPDATE,
]))

/** 页面原始数据 */
const pageData = ref<CmsJson[]>()
/** 可编辑数据 */
const editData = ref<CmsJson[]>()
/** 添加组件 */
const addComponent = ref(false)
/** 选中的组件 */
const checkedComponent = ref<string>()

onBeforeMount(getPageCms)

/**
 * 获取页面Cms内容
 */
async function getPageCms() {
  pageData.value = await getCms(props.config.id)
  editData.value = cloneDeep(pageData.value)
}

/**
 * 新建
 */
function addItem() {
  if (props.config.component === true) {
    addComponent.value = true
  }
}
</script>

<template>
  <div flex="~ 1 col gap4" p="y4 x10">
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
        >
          <template #left>
            <div v-html="saveIcon" />
          </template>
        </ZBtn>
      </div>
    </div>

    <!-- 内容编辑区 -->
    <div flex="~ 1 gap2">
      <!-- 组件列表 -->
      <List
        v-if="config.component === true"
        v-model="checkedComponent"
        :list="editData?.filter(v => v.componentId)
          .map(v => ({
            ...v,
            label: CMS_COMPONENTS[v.componentId!]?.label
          }))
        "
        :is-edit="isEdit"
        class="w100"
      >
        <q-menu>
          123
        </q-menu>
      </List>
    </div>
  </div>
</template>
