<script lang="ts" setup>
import { isClient } from '@vueuse/core'
import { omit } from 'zjf-utils'

const { rootData, rootId, databaseId } = useDatabase()
const { query } = useRoute()
const $router = useRouter()
const { scrollTo } = useScrollApp()

const children = computed(() => {
  return rootData.value?.find(v => v.id === databaseId.value)?.children
})

/** 子库Id */
const bDbId = ref<string>()
/** 模块Id */
const partId = ref<string>()
/** 表格Id */
const tableId = ref<string>()

onBeforeMount(() => {
  if (query.tableId) {
    tableId.value = query.tableId as string
    children.value?.some((b_db) => {
      if (b_db.children?.some((part) => {
        if (part.children?.some((table) => table.id === tableId.value)) {
          partId.value = part.id
          return true
        }
      })) {
        bDbId.value = b_db.id
          return true
      }
    })
    $router.replace({
      query: omit(query, 'tableId'),
    })
  }
})

onMounted(() => {
  if (bDbId.value && isClient) {
    nextTick(() => {
      const dom = document.querySelector(`#b_db_${bDbId.value}`) as HTMLElement
      if (dom)
        scrollTo(dom.offsetTop + 160, undefined, 300)
    })
  }
})
</script>

<template>
  <div flex="~ col gap6">
    <ZExpansion
      v-for="b_db in children"
      :key="b_db.id"
      :id="`b_db_${b_db.id}`"
      :label="b_db.nameZH"
      :initialValue="b_db.id === bDbId"
    >
      <template v-for="(part, index) in b_db.children" :key="part.id">
        <ZExpansion p="l7 y1" :initialValue="part.id === partId">
          <template #label>
            <div text-lg font-600 truncate v-text="part.nameZH" />
          </template>
          <div
            p="l8" grid="~ cols-1 gap-x2"
            sm="grid-cols-2" lg="grid-cols-3"
            xl="gap-x6"
          >
            <q-item
              v-for="table in part.children"
              :key="table.id"
              :to="{
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
        </ZExpansion>
        <div
          v-if="b_db.children && index < b_db.children.length - 1"
          h1px bg-grey-3 m-auto
          style="width: calc(100% - 90px)"
        />
      </template>
    </ZExpansion>
  </div>
</template>
