<script lang="ts" setup>
import type { ZMenu1Props } from 'shared/components/menu/ZMenu1.vue'
import Database from './Database.vue'

const { rootId, rootData, databaseId, getDataByRootId } = useDatabase()
const { query } = useRoute()
const $router = useRouter()
const { el, scrollTo } = useScrollApp()
const { height } = useAppHeader()

/** 加载中 */
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  try {
    databaseId.value = undefined
    await getDataByRootId(rootId.value)
    if (rootData.value?.length)
      databaseId.value = rootData.value.find(v => v.id === query.databaseId)?.id || rootData.value[0].id
    if (databaseId.value && databaseId.value !== query.databaseId)
      $router.push({ query: { rootId: rootId.value, databaseId: databaseId.value } })
  }
  finally {
    loading.value = false
  }
})

/** 数据库菜单 */
const menu = computed<ZMenu1Props['list']>(() => {
  return rootData.value?.map((item) => {
    const { id, nameZH } = item
    return {
      id,
      label: nameZH,
      to: {
        query: {
          rootId: rootId.value,
          databaseId: id,
        }
      },
    }
  })
})

/** 数据库的英文名 */
const nameEN = computed(() => rootData.value?.find(v => v.id === databaseId.value)?.nameEN)

watch(
  databaseId,
  () => {
    if (el.value) {
      if (el.value.getScrollPosition().top > 265)
        scrollTo(265)
    }
  }
)
</script>

<template>
  <div flex="~ col gap6" relative>
    <ZLoading :value="loading" />
    <div flex="~ col">
      <!-- Header -->
      <div
        flex="~ row gap4" p="t10 b6" bg-grey-1 sticky z-1
        :style="{ top: `${height - 17}px` }"
      >
        <div flex-1 w0>
          <ZMenu1 v-model="databaseId" :list="menu" />
        </div>
        <RouterLink
          :to="!nameEN ? '' : {
            path: '/database/intro',
            query: {
              rootId,
              nameEN,
            }
          }"
          h12 flex="~ items-center"
        >
          <div leading-4.5
           b-b="1px primary-1">
            查看数据库介绍
          </div>
        </RouterLink>
      </div>
      <!-- Main -->
      <div>
        <Empty
          v-if="
            !databaseId
            || !rootData?.find(v => v.id === databaseId)?.children?.length
          "
          icon="database"
        />
        <Database v-else />
      </div>
    </div>
  </div>
</template>
