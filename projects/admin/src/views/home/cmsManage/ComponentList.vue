<script lang="ts" setup>
import { getRandomID } from 'zjf-utils'
import { cloneDeep } from 'lodash'
import type { CmsJson } from 'shared/types/cms.interface'

const { addComponent, editData, selectComponent, isEdit } = useEditCms()
const { byAbsolute } = usePosition()

/**
 * 删除组件
 */
function deleteComponent(index: number, item: CmsJson) {
  editData.value.splice(index, 1)
  if (selectComponent.value?.id === item.id)
    selectComponent.value = editData.value[0]
}
</script>

<template>
  <q-scroll-area
    class="card"
    w30 lg="w50" xl="w75" xxl="w100"
  >
    <div p="y4 x2" xl="px4">
      <List
        :model-value="selectComponent"
        v-model:list="editData"
        value-text="id"
        default-label="未命名组件"
        :isEdit="typeof addComponent !== 'number' && isEdit"
        @update:model-value="val => {
          if (selectComponent?.id !== val.id) {
            selectComponent = val
            addComponent = undefined
          }
        }"
      >
        <template #default="{ item, index }">
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="editData.splice(index + 1, 0, {
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
                    @click="addComponent = index"
                  >
                    <q-item-section>
                      <div i-mingcute:arrow-to-up-line />
                      向上插入
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    @click="addComponent = index + 1"
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
              @click="deleteComponent(index, item)"
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
