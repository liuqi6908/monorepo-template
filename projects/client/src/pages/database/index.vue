<script setup lang="ts">
import bg from '~/assets/bg/database.webp'
import type { ZMenuProps } from 'shared/components/menu/ZMenu.vue'
import Root from '~/views/database/Root.vue'

const { rootList, rootId, getRootList } = useDatabase()
const { scrollTo } = useScrollApp()
const { query } = useRoute()
const { nav } = useSysConfig()
const $router = useRouter()

/** 加载中 */
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  rootId.value = undefined
  try {
    await getRootList()
    if (rootList.value?.length)
      rootId.value = rootList.value.find(v => v.id === query.rootId)?.id || rootList.value[0].id
    if (rootId.value && rootId.value !== query.rootId)
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
        path: '/database',
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
    <Banner text-grey-1 :img="bg" :title="nav?.databaseDesc" />
    <div pb20>
      <Empty v-if="!menu?.length" icon="database" />
      <div v-else w-limited-1 flex="~ gap4" sm="gap6" lg="gap8" xl="gap10">
        <div pt10>
          <ZMenu v-model="rootId" :list="menu" sticky top-41 />
        </div>
        <Root :key="rootId" flex-1 w0 />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
