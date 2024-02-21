<script setup lang="ts">
import bg from '~/assets/bg/database.webp'
import type { ZMenuProps } from 'shared/components/menu/ZMenu.vue'
import Root from 'shared/views/data/database/index.vue'
import DataSearch from '~/views/database/DataSearch.vue'

const { rootList, rootId, getRootList } = useDatabase()
const { el, scrollTo } = useScrollApp()
const { nav } = useSysConfig()
const $router = useRouter()
const $route = useRoute()
const { height } = useAppHeader()
const { isLogin } = useUser()

/** 加载中 */
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  rootId.value = undefined
  try {
    await getRootList()
    const { name, query } = $route
    if (rootList.value?.length)
      rootId.value = rootList.value.find(v => v.id === query.rootId)?.id || rootList.value[0].id
    if (name === 'database' && rootId.value && rootId.value !== query.rootId)
      $router.push({ query: { rootId: rootId.value } })
  }
  finally {
    loading.value = false
  }
})

/** 数据大类菜单 */
const menu = computed<ZMenuProps['list']>(() => {
  return rootList.value?.map((item) => {
    const { id, nameZH } = item
    return {
      id,
      label: nameZH,
      to: {
        query: {
          rootId: id,
        },
      },
    }
  })
})

watch(rootId, () => scrollTo(0))
</script>

<template>
  <div>
    <div relative>
      <Banner text-grey-1 :img="bg" :title="nav?.databaseDesc" />
      <DataSearch
        v-if="isLogin"
        absolute-x-center z-1 bottom-7
      />
    </div>
    <div pb20>
      <Empty v-if="!menu?.length" icon="database" />
      <div v-else w-limited-1 flex="~ gap4" sm="gap6" lg="gap8" xl="gap10">
        <div pt10>
          <ZMenu
            v-model="rootId" :list="menu" sticky
            :style="{ top: `${height + 23}px` }"
          />
        </div>
        <Root
          :el="el"
          :scroll-to="scrollTo"
          :height="height - 17"
          :distance="274"
          :key="rootId"
          flex-1 w0
        />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
