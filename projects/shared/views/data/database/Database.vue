<script lang="ts" setup>
import { computed, onMounted, nextTick } from 'vue'
import { isClient, useElementBounding } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { omit } from 'zjf-utils'
import type { IDataDirectory } from 'zjf-types'
import ZExpansion from '../../../components/expansion/ZExpansion.vue'
import { useSysConfig } from '../../../composables/app'
import { useDatabase } from '../../../composables/database'

defineOptions({
  name: 'Database',
})

interface Props {
  data?: IDataDirectory[]
  top?: boolean
  height?: number
  scrollTo?: (offset: number, axis?: "vertical" | "horizontal", duration?: number | undefined) => void
}

const props = withDefaults(defineProps<Props>(), {
  height: 0
})

const { isAdmin, zoomRatio } = useSysConfig()
const { rootId, databaseId } = useDatabase()
const $route = useRoute()
const $router = useRouter()

/** 表格id */
const tableId = computed(() => $route.query.tableId as string | undefined)

/** 拓展列表 */
const expandList = computed(() => props.data?.filter(v => v.level !== 4))
/** 表格列表 */
const tableList = computed(() => props.data?.filter(v => v.level === 4))

onMounted(() => {
  const { height, scrollTo } = props
  if (
    isClient && tableId.value && scrollTo && !isAdmin.value
    && tableList.value?.map(v => v.id).includes(tableId.value)
  ) {
    nextTick(() => {
      const dom = document.querySelector(`#table_${tableId.value}`) as HTMLElement
      if (dom) {
        const { top } = useElementBounding(dom)
        scrollTo(top.value - height - 120, undefined, 300)
        $router.replace({
          query: omit($route.query, 'tableId')
        })
      }
    })
  }
})

/**
 * 该数据资源是否包含表格
 */
function hasTable(item?: IDataDirectory): boolean {
  if (!tableId.value || !item?.children?.length)
    return false

  return item.children.some((v) => {
    if (v.id === tableId.value)
      return true
    else
      return hasTable(v)
  })
}
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
        :initial-value="hasTable(item)"
      >
        <Database
          :data="item.children"
          :height="height"
          :scroll-to="scrollTo"
        />
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
        :id="`table_${table.id}`"
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

        <q-tooltip
          v-if="zoomRatio >= 1"
          anchor="top middle"
          self="bottom middle"
          :offset="[0, 6]"
          class="rounded-1!"
        >
          {{ table.nameZH }}
        </q-tooltip>
      </q-item>
    </div>
  </div>
</template>
