<script lang="ts" setup>
import { computed } from 'vue'
import type { IDataDirectory } from 'zjf-types'
import ZExpansion from '../../../components/expansion/ZExpansion.vue'
import { useSysConfig } from '../../../composables/app'
import { useDatabase } from '../../../composables/database'

defineOptions({
  name: 'Database',
})

const props = defineProps<{
  data?: IDataDirectory[]
  top?: boolean
}>()

const { isAdmin } = useSysConfig()
const { rootId, databaseId } = useDatabase()

/** 拓展列表 */
const expandList = computed(() => props.data?.filter(v => v.level !== 4))
/** 表格列表 */
const tableList = computed(() => props.data?.filter(v => v.level === 4))
</script>

<template>
  <div
    flex="~ col"
    :gap="top ? 6 : 0"
  >
    <template v-for="(item, index) in expandList" :key="item.id">
      <ZExpansion
        :label="item.nameZH"
        :top="top"
      >
        <Database :data="item.children" />
      </ZExpansion>
      <div
        v-if="!top && expandList && index < expandList.length - 1"
        h1px bg-grey-3 m-auto
        style="width: calc(100% - 90px)"
      />
    </template>

    <!-- 表格 -->
    <div
      v-if="tableList?.length"
      bg-grey-2
      grid="~ cols-1 gap-x2"
      sm="grid-cols-2" lg="grid-cols-3"
      xl="gap-x6"
      :style="{
        padding: top ? '10px 16px' : '0 0 0 32px'
      }"
    >
      <q-item
        v-for="table in tableList"
        :key="table.id"
        :to="isAdmin ? undefined : {
          path: '/database/table',
          query: {
            rootId,
            databaseId,
            tableId: table.id,
          }
        }"
        hover:text-primary-1
        clickable min-h-42px
      >
        <q-item-section>
          <q-item-label lines="1" text-lg>
            {{ table.nameZH }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>
