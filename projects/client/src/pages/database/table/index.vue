<script lang="ts" setup>
import type { QTableProps } from 'quasar'
import { DesktopQueueStatus, MinioBucket } from 'zjf-types'
import { browser, pick } from 'zjf-utils'
import type { IDataDirectory } from 'zjf-types'
import Purchase from '~/views/database/Purchase.dialog.vue'

/** footer元素 */
const footer = ref<HTMLElement>()

const { rootData, rootId, rootList, databaseId, getDataByRootId, getRootList } = useDatabase()
const { query } = useRoute() as {
  query: Record<string, string>
}
const $router = useRouter()
const { height } = useWindowSize()
const { bottom, update } = useElementBounding(footer)
const { isDesktop, isLogin, isVerify } = useUser()

/** 加载中 */
const loading = ref(false)
/** 当前表格的Id */
const tableId = ref<string>()
/** 当前表格的英文名 */
const tableName = computed(() => {
  let obj: IDataDirectory | undefined
  rootData.value?.find(v => v.id === databaseId.value)?.children?.some((b_db) => {
    return b_db.children?.some((part) => {
      return part.children?.some((table) => {
        if (table.id === tableId.value) {
          obj = table
          return true
        }
      })
    })
  })
  if (obj)
    return pick(obj, 'nameZH', 'nameEN')
})

/** 字段说明的列 */
const fieldsCols: QTableProps['columns'] = [
  { label: '字段', name: 'nameZH', field: 'nameZH', align: 'left' },
  { label: '含义', name: 'description', field: 'description', align: 'left' },
]
/** 字段说明的行 */
const fieldRows = ref<QTableProps['rows']>()

/** 数据预览的列 */
const previewCols: QTableProps['columns'] = reactive([])
/** 数据预览的行 */
const previewRows: any[] = reactive([])

/** 是否预购 */
const isPurchased = computed(() => rootList.value?.find(v => v.id === rootId.value)?.nameZH.includes('预购'))
/** 是否申请了云桌面 */
const isApplyDesktop = ref(false)
/** 表格文件是否存在 */
const isExist = ref(false)
/** 申请采购对话框 */
const dialog = ref(false)

onBeforeMount(() => {
  rootId.value = query.rootId
  databaseId.value = query.databaseId
  tableId.value = query.tableId
  if (!rootId.value || !databaseId.value || !tableId.value)
    return $router.replace('/database')
  init()
})

/**
 * 页面初始化
 */
async function init() {
  if (!tableId.value)
    return

  loading.value = true
  try {
    if (!rootList.value?.find(v => v.id === rootId.value))
      getRootList()
    if (!rootData.value?.find(v => v.id === databaseId.value))
      getDataByRootId(rootId.value)

    fieldRows.value = await getFieldsByTableApi(tableId.value)
    previewRows.push(...(await getDataPreviewByTableApi(tableId.value))
      .filter((row: any) => Object.values(row).some(v => v)))
    if (previewRows.length) {
      for (const field in previewRows[0]) {
        previewCols?.push({
          name: field,
          field,
          label: field,
          align: 'center',
        })
      }
    }
    else {
      throw new Error
    }
  }
  catch (_) {
    previewCols?.push({
      name: 'empty',
      field: 'empty',
      label: '暂无数据',
      align: 'center',
    })
  }
  finally {
    loading.value = false
    update()

    // 预购数据
    if (isPurchased.value)
      return
    // 不在云桌面 且 已通过认证，判断是否已申请云桌面
    if (!isDesktop.value && isVerify.value) {
      getRequestInfo()
    }
    // 在云桌面中，判断该表格文件是否存在
    else if (isDesktop.value && tableName.value) {
      isExist.value = await fileIsExistApi({
        bucket: MinioBucket.DATA,
        path: `/download/${rootId.value}/${tableName.value.nameEN}.zip`
      })
    }
  }
}

/**
 * 获取云桌面申请信息
 */
async function getRequestInfo() {
  const res = await getOwnDesktopRequestApi()
  if (res) {
    const { queue } = res
    if (queue?.status === DesktopQueueStatus.USING)
      isApplyDesktop.value = true
  }
}

/**
 * 下载数据
 */
async function downloadData() {
  if (!tableId.value)
    return
  const url = await getTableDownloadLinkApi(tableId.value)
  browser.downloadUrl(url, `${tableName.value?.nameZH}.zip` ?? '')
}
</script>

<template>
  <div flex="~ col gap16" pb16 relative>
    <ZLoading :value="loading" />

    <div w-limited-1 flex="~ col gap6">
      <!-- Header -->
      <div py6>
        <RouterLink
          :to="{
            path: '/database',
            query: {
              rootId,
              databaseId,
              tableId,
            },
          }"
          flex="~ items-center gap4"
        >
          <div w8 h8 flex-center>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z" fill="#6E7686"/>
            </svg>
          </div>
          <h4 text-grey-8>
            数据资源介绍
          </h4>
        </RouterLink>
      </div>

      <!-- Main -->
      <div flex="~ col gap10">
        <div flex="~ col gap4">
          <div font-600>
            表格字段说明
          </div>
          <ZTable
            :rows="fieldRows"
            :cols="fieldsCols"
            :disablePagination="!!fieldRows?.length"
            :params="{
              noDataLabel: '管理员正在配置中'
            }"
          >
            <template #body-cell-description="props">
              <td whitespace="pre-wrap!">
                {{ (props as any).row.description }}
              </td>
            </template>
          </ZTable>
        </div>

        <div flex="~ col gap4">
          <div font-600>
            表格数据预览
          </div>
          <ZTable
            :rows="previewRows"
            :cols="previewCols"
            :params="{
              noDataLabel: '管理员正在配置中'
            }"
          />
        </div>

        <div text-primary-1>
          引用规范：{{ rootData?.find(v => v.id === databaseId)?.reference || '暂无引用规范' }}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      ref="footer" class="footer"
      flex="center col gap2" py4 sticky bottom-0 bg-grey-1
      :style="{
        boxShadow: bottom < height ? '' : '0px -2px 16px 0px #00000014'
      }"
    >
      <!-- 操作按钮 -->
      <ZBtn
        v-if="isPurchased"
        label="建议采购"
        :disable="!isVerify"
        size="big"
        @click="dialog = true"
      />
      <ZBtn
        v-else-if="!isDesktop && !isApplyDesktop"
        label="数据申请使用"
        :disable="!isLogin"
        size="big"
        @click="$router.push('/request')"
      />
      <RouterLink
        v-else-if="!isDesktop && isApplyDesktop"
        to="/userCenter/cloudDesktop"
      >
        <ZBtn
          label="请前往云桌面下载"
          size="big" w="44!"
        />
      </RouterLink>
      <ZBtn
        v-else
        label="数据下载"
        :disable="!isLogin || !isExist"
        size="big"
        @click="downloadData"
      />

      <!-- 提示信息 -->
      <div v-if="!isLogin" text-grey-5>
        您尚未登录，请
        <RouterLink
          font-500 underline="~ offset-2"
          to="/auth/login"
          v-text="'登录'"
        />
        后重试
      </div>
      <div v-else-if="isPurchased && !isVerify" text-grey-5>
        用户认证通过后才能建议采购，请先前往
        <RouterLink
          font-500 underline="~ offset-2"
          to="/userCenter/authentication"
          v-text="'用户中心'"
        />
        进行认证
      </div>
      <div v-else-if="!isPurchased && isDesktop && !isExist" text-grey-5>
        管理员正在配置中
      </div>
    </div>

    <!-- 建议采购 -->
    <Purchase v-model="dialog" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style lang="scss" scoped>
.footer {
  .z-btn {
    width: 144px;
    &.disabled {
      opacity: 1 !important;
      &::before {
        background-color: var(--grey-4);
      }
    }
  }
}
</style>
