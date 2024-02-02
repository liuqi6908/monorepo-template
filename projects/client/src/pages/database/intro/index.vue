<script lang="ts" setup>
import Intro from 'shared/views/data/intro/index.vue'

const { rootData, rootId, databaseId } = useDatabase()
const { query } = useRoute() as {
  query: Record<string, string>
}
const $router = useRouter()
const { el, scrollTo } = useScrollApp()
const { height } = useAppHeader()

/** 数据库的英文名 */
const nameEN = ref<string>()

onBeforeMount(async () => {
  rootId.value = query.rootId
  nameEN.value = query.nameEN
  if (!rootId.value || !nameEN.value)
    return $router.replace('/database')

  databaseId.value = rootData.value?.find(v => v.nameEN === nameEN.value)?.id
})
</script>

<template>
  <div w-limited-1 flex="~ col gap6" pb20>
    <!-- Header -->
    <div py6>
      <RouterLink
        :to="{
          path: '/database',
          query: {
            rootId,
            databaseId,
          }
        }"
        flex="~ items-center gap4"
      >
        <div w8 h8 flex-center>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z" fill="#6E7686"/>
          </svg>
        </div>
        <h4 text-grey-8>
          数据库介绍
        </h4>
      </RouterLink>
    </div>

    <!-- Main -->
    <Intro
      v-if="rootId && nameEN"
      :root-id="rootId"
      :name-en="nameEN"
      :el="el"
      :scroll-to="scrollTo"
      :top="height"
      :max-height="`calc(100vh - ${height}px)`"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
