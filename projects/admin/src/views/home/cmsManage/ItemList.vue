<script lang="ts" setup>
import { getRandomID } from 'zjf-utils'
import { cloneDeep } from 'lodash'
import type { CmsConfigParam, CmsJson } from 'shared/types/cms.interface'

const {
  addItem,
  editData,
  selectComponent,
  selectItem,
  isEdit,
  pageConfig,
} = useEditCms()
const { byAbsolute } = usePosition()

/** 列表项数组 */
const itemList = computed({
  get: () => selectComponent.value?.json,
  set: (newVal: any) => {
    if (selectComponent.value)
      selectComponent.value.json = newVal
    if (pageConfig.value?.component !== true)
      editData.value = newVal
  }
})

/**
 * 删除列表项
 */
function deleteItem(index: number, item: Partial<Record<CmsConfigParam | 'id', string>>) {
  selectComponent?.value?.json?.splice(index, 1)
  if (selectItem.value?.id === item.id)
    selectItem.value = selectComponent?.value?.json?.[0] as CmsJson
}
</script>

<template>
  <q-scroll-area
    class="card"
    w30 lg="w50" xl="w75" xxl="w100"
  >
    <div p="y4 x2" xl="px4">
      <List
        v-model="selectItem"
        v-model:list="itemList"
        label-text="title"
        value-text="id"
        :isEdit="isEdit"
      >
        <template #default="{ item, index }">
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="itemList?.splice(index + 1, 0, {
                ...cloneDeep(item),
                id: getRandomID(),
              })"
            >
              <q-item-section>
                <div i-mingcute:copy-line />
                复制
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <div i-mingcute:add-circle-line />
                插入
                <div w4 h4 text-grey-4 ml-auto i-mingcute:right-line />
              </q-item-section>
              <q-menu
                class="more-menu"
                :id="`upsert-menu-${item.id}`"
                auto-close
                anchor="top right"
                @before-show="byAbsolute(`upsert-menu-${item.id}`, [6, -5])"
              >
                <q-list>
                  <q-item
                    clickable
                    @click="addItem = index"
                  >
                    <q-item-section>
                      <div i-mingcute:arrow-to-up-line />
                      向上插入
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    @click="addItem = index + 1"
                  >
                    <q-item-section>
                      <div i-mingcute:arrow-to-down-line />
                      向下插入
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="deleteItem(index, item)"
            >
              <q-item-section>
                <div i-mingcute:delete-2-line />
                删除
              </q-item-section>
            </q-item>
          </q-list>
        </template>
      </List>
    </div>
  </q-scroll-area>
</template>
