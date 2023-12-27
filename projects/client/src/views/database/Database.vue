<script lang="ts" setup>
const { rootData, rootId, databaseId } = useDatabase()

const children = computed(() => {
  return rootData.value?.find(v => v.id === databaseId.value)?.children
})
</script>

<template>
  <div flex="~ col gap6">
    <ZExpansion
      v-for="b_db in children"
      :key="b_db.id"
      :label="b_db.nameZH"
    >
      <template v-for="(part, index) in b_db.children" :key="part.id">
        <ZExpansion p="l7 y1">
          <template #label>
            <div text-lg font-600 line-clamp-1 v-text="part.nameZH" />
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
