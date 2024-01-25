<script lang="ts" setup>
import { getRandomID } from 'zjf-utils'
import type { CmsComponent, CmsJson, CmsKey } from 'shared/types/cms.interface'

const componentContainer = ref<HTMLElement>()

const { width } = useElementSize(componentContainer)
const { addComponent, selectComponent, editData } = useEditCms()

/**
 * 添加组件
 */
function addComponentClick(key: CmsKey, item: CmsComponent[CmsKey]) {
  if (typeof addComponent.value !== 'number')
    return

  const component: CmsJson = {
    id: getRandomID(),
    label: item.label,
    componentId: key,
    json: CMS_COMPONENTS[key].param.includes('list') ? [] : [{}],
  }
  editData.value.splice(addComponent.value, 1, component)
  addComponent.value = undefined
  selectComponent.value = component
}
</script>

<template>
  <div class="card" p4 flex="~ col gap6">
    <div text-sm font-500>
      选择组件
    </div>
    <q-scroll-area flex-1>
      <div flex="~ col gap10">
        <div
          ref="componentContainer"
          grid="~ gap4"
          :style="{
            'grid-template-columns': `repeat(${Math.floor(width / 360) || 1}, minmax(0, 1fr))`
          }"
        >
          <ComponentCard
            v-for="(item, key) in CMS_COMPONENTS"
            :key="key"
            :label="item.label"
            :icon="`<svg width='33' height='32' viewBox='0 0 33 32' xmlns='http://www.w3.org/2000/svg'>${item.icon}</svg>`"
            :color="item.color"
            @click="addComponentClick(key, item)"
          />
        </div>
        <div rounded-2 py4 text="sm center" bg-grey-2>
          更多组件，联系技术支持单位
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>