<script lang="ts" setup>
import { computed, ref, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { QScrollArea } from 'quasar'
import Database from './Database.vue'
import Empty from '../Empty.vue'
import ZLoading from '../../../components//loading/ZLoading.vue'
import ZSubMenu from '../../../components/menu/ZSubMenu.vue'
import { useDatabase } from '../../../composables/database'
import { useSysConfig } from '../../../composables/app'
import type { ZSubMenuProps } from '../../../components/menu/ZSubMenu.vue'

interface Props {
  el?: InstanceType<typeof QScrollArea>
  scrollTo?: (offset: number, axis?: "vertical" | "horizontal", duration?: number | undefined) => void
  height?: number
  distance?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 0,
})

const { rootId, rootData, databaseId, getDataByRootId } = useDatabase()
const { isAdmin } = useSysConfig()
const { query } = useRoute()
const $router = useRouter()

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
const menu = computed<ZSubMenuProps['list']>(() => {
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
    const { el, scrollTo, distance } = props
    if (el && scrollTo && typeof distance === 'number') {
      if (el.getScrollPosition().top > distance)
        scrollTo(distance)
    }
  }
)

const children = computed(() => {
  return rootData.value?.find(v => v.id === databaseId.value)?.children
})
</script>

<template>
  <div flex="~ col gap6" relative>
    <ZLoading :value="loading" />

    <div flex="~ col">
      <!-- Header -->
      <div
        flex="~ row gap4" p="t10 b6" bg-grey-1 sticky z-1
        :style="{ top: `${height}px` }"
      >
        <div flex-1 w0>
          <ZSubMenu v-model="databaseId" :list="menu" />
        </div>
        <RouterLink
          v-if="!isAdmin"
          :to="!nameEN ? '' : {
            path: '/database/intro',
            query: {
              rootId,
              nameEN,
            }
          }"
          h12 flex="~ items-center"
        >
          <div leading-4.5 b-b="1px primary-1">
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
        <Database
          v-else
          :data="children" top
          :height="height"
          :scroll-to="scrollTo"
        />
      </div>
    </div>
  </div>
</template>
