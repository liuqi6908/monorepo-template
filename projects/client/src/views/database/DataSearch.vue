<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import type { IDataDirectory, IDataField } from 'zjf-types'

const { zoomRatio } = useSysConfig()
const $router = useRouter()
const { rootId, databaseId } = useDatabase()

/** 加载中 */
const loading = ref(false)
/** 当前所选层级 */
const levelOptions = [
  { label: '数据库', value: 1 },
  { label: '子库', value: 2 },
  { label: '模块', value: 3 },
  { label: '表格', value: 4 },
  { label: '字段', value: 5 },
]
const level = ref(levelOptions[3])
/** 搜索关键词 */
const value = ref('')
/** 搜索结果弹窗 */
const dialog = ref(false)
/** 搜索结果 */
const searchResults = ref<(IDataDirectory | IDataField)[]>([])

/**
 * 搜索
 */
async function handleSearch() {
  dialog.value = true
  loading.value = true

  try {
    searchResults.value = await getDataSearchApi({
      level: level.value.value,
      value: value.value,
    })
  }
  catch (_) {
    searchResults.value = []
  }
  finally {
    loading.value = false
  }
}

/** 处理后的搜索结果 */
const handleSearchResults = computed(() => {
  // 获取资源路径
  function getResourcePath(data?: IDataDirectory): string {
    if (!data)
      return ''
    const parent = data.parent
    if (!parent)
      return data.nameZH
    else
      return `${getResourcePath(parent)}/${data.nameZH}`
  }

  return searchResults.value.map((item) => {
    return {
      ...item,
      resourcePath: getResourcePath((item as IDataField).directory ?? (item as IDataDirectory).parent),
    }
  })
})

/**
 * 跳转路由
 */
function goToRouter(data: IDataDirectory | IDataField) {
  let directory = data as IDataDirectory
  const field = data as IDataField
  // 表格 / 字段
  if (field.directory || directory.level === 4) {
    directory = field.directory ?? directory
    $router.push({
      path: '/database/table',
      query: {
        rootId: directory.rootId,
        databaseId: directory.path?.[1],
        tableId: directory.id,
      }
    })
  }
  // 数据库 / 子库 / 模块
  else {
    const to: RouteLocationRaw = {
      path: '/database',
      query: {
        rootId: directory.rootId,
        databaseId: directory.path?.[1],
      },
    }
    if (directory.level === 2)
      to.query!.subDatabaseId = directory.id
    else if (directory.level === 3)
      to.query!.moduleId = directory.id
    $router.replace(to)
    rootId.value = databaseId.value = undefined
    nextTick(() => {
      rootId.value = directory.rootId
      databaseId.value = directory.path?.[1]
    })
  }
}
</script>

<template>
  <div w="80%" max-w-196 flex bg-grey-1>
    <ZSelect
      v-model="level"
      :options="levelOptions"
      :params="{
        popupContentClass: 'z-select-dropdown-menu data-search'
      }"
      w26 b-r="1px grey-3"
    />
    <div flex="~ 1 col" w0>
      <ZInput
        v-model="value"
        placeholder="请输入想要搜索的数据"
        @keydown.enter="handleSearch"
      />
      <div>
        <q-popup-proxy
          v-model="dialog"
          class="z-select-dropdown-menu data-search search-results"
          :offset="[0, 8]"
          :breakpoint="APP_MIN_WIDTH"
        >
          <q-list min-h-40>
            <ZLoading :value="loading" />
            <div v-if="!searchResults.length" absolute-center>
              暂无数据
            </div>
            <template v-else>
              <q-item
                v-for="item in handleSearchResults"
                :key="item.id"
                v-close-popup
                clickable
                @click="goToRouter(item)"
              >
                <q-item-section>
                  <div max-w-full truncate>
                    <span v-text="item.nameZH" />
                    <span
                      v-if="item.resourcePath"
                      text-grey-5
                      v-text="`（${item.resourcePath}）`"
                    />
                  </div>
                </q-item-section>

                <q-tooltip
                  v-if="zoomRatio >= 1 && item.resourcePath"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[0, 6]"
                  class="rounded-1!"
                  max-w="80%!"
                >
                  {{ item.resourcePath }}/{{ item.nameZH }}
                </q-tooltip>
              </q-item>
            </template>
          </q-list>
        </q-popup-proxy>
      </div>
    </div>
    <ZBtn
      label="搜索"
      color="secondary"
      @click="handleSearch"
    >
      <template #left>
        <div w5 h5 i-mingcute:search-2-line />
      </template>
    </ZBtn>
  </div>
</template>

<style lang="scss" scoped>
.z-select, .z-input {
  :deep(.q-field__control) {
    &::before, &::after {
      display: none;
    }
  }
}

.z-select {
  :deep(.q-field__native) {
    > span {
      overflow: visible !important;
    }
  }
}

.z-btn {
  padding: 0 8px;

  :deep(.q-btn__content) {
    > div {
      gap: 4px;
    }
  }
}
</style>

<style lang="scss">
.z-select-dropdown-menu.data-search {
  .q-item {
    text-align: left;
  }

  &.search-results {
    &.q-menu {
      width: calc(80% - 172px);
      max-width: 612px !important;
    }

    &.q-dialog {
      .q-dialog__inner > .q-list {
        background-color: var(--grey-1);
        width: 90%;
        padding: 8px 0;
        max-height: 90%;
        border-radius: 0;
      }
    }
  }
}
</style>
