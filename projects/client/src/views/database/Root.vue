<script lang="ts" setup>
const { rootId, rootData, databaseId, getDataByRootId } = useDatabase()
const $route = useRoute()
const $router = useRouter()

/** 加载中 */
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = true
  try {
    databaseId.value = undefined
    await getDataByRootId(rootId.value)
    if (rootData.value?.length)
      databaseId.value = rootData.value.find(v => v.id === $route.query.databaseId)?.id || rootData.value[0].id
    if (databaseId.value)
      $router.push({ query: { rootId: rootId.value, databaseId: databaseId.value } })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div flex="~ col gap6" relative>
    <ZLoading :value="loading" />
    <div flex="~ col gap6">
      <!-- Header -->
      <div flex="~ row gap4">
        <div flex-1 w0 />
        <RouterLink
          to="/database/intro"
          h12 flex="~ items-center"
        >
          <div leading-4.5 b-b="1px primary-1">
            查看数据库介绍
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
