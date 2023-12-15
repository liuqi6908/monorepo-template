import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import type { IDataDirectory } from 'zjf-types'
import { cloneDeep } from 'lodash-es'

const { $get } = useRequest()

let rootTabList = reactive<TabItem[]>([])
const rootData = ref<IDataDirectory[]>([])
const allData = ref<IDataDirectory[]>([])
const databaseTab = ref<TabItem[]>([])
const loading = ref(false)
const verifyTree = ref([{ nameZH: '数据库类型', id: 'database', children: [] }])

export function useDatabase() {
  const downloadDescribeByRole = async (roleName: string) => {
    return await $get(`data-permission/data-role/${roleName}`)
  }

  /** 获取指定分类的数据 */
  const getDataByRootId = async (dataRootId: string) => {
    loading.value = true
    const res = await $get<IDataDirectory[]>(`/data/list/${dataRootId}`).finally(() => {
      loading.value = false
    })
    const tabs = [] as TabItem[]

    if (res[0].children) {
      res[0].children.forEach((item) => {
        // const view = judgePermission(item.viewDataRoles)
        // const download = judgePermission(item.downloadDataRoles)

        tabs.push({
          label: item.nameZH,
          id: item.nameEN,
          children: item.children,
          nameEN: item.nameEN,
          isRequest: false,
          reference: item.reference,

        })
      })
    }
    databaseTab.value = cloneDeep(tabs)
  }

  const geRootData = async () => {
    loading.value = true
    rootData.value = await $get<IDataDirectory[]>('/data/root/list')

    if (rootData.value && rootData.value.length) {
      const rootList = [] as TabItem[]
      rootData.value.forEach(async (item) => {
        rootList.push({
          id: item.id,
          label: item.nameZH,
          isRequest: false,
        })
      })

      rootTabList = cloneDeep(rootList)
    }
    loading.value = false
  }

  return {
    getDataByRootId,
    geRootData,
    rootData,
    allData,
    rootTabList,
    verifyTree,
    loading,
    databaseTab,
    downloadDescribeByRole,
  }
}
