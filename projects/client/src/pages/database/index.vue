<script setup lang="ts">
import bg from '~/assets/bg/database.webp'
import type { ZMenuProps } from 'shared/components/menu/ZMenu.vue'
import Root from '~/views/database/Root.vue'

const { rootList, rootId, getRootList } = useDatabase()
const { scrollTo } = useScrollApp()
const $route = useRoute()
const $router = useRouter()

/** 加载中 */
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  try {
    await getRootList()
    if (rootList.value?.length)
      rootId.value = rootList.value.find(v => v.id === $route.query.rootId)?.id || rootList.value[0].id
    if (rootId.value)
      $router.push({ query: { rootId: rootId.value } })
  }
  finally {
    loading.value = false
  }
})

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
    <Banner text-grey-1 :img="bg" title="数据库" />
    <div p="t10 b20" relative>
      <ZLoading :value="loading" />
      <ZEmpty v-if="!menu?.length" icon="database" />
      <div v-else w-limited-1 flex="~ gap10">
        <div>
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
