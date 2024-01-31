import type { IDataDirectory } from 'zjf-types'

/** 加载中 */
const loading = ref(false)

/** 数据资源列表 */
const dataList = ref<IDataDirectory[]>()
/** 当前选中的数据资源ID */
const selectedId = ref<IDataDirectory['id']>()

export function useDataRoot() {
  /**
   * 查询数据资源列表
   */
  async function queryDataList() {
    loading.value = true

    try {
      dataList.value = await getAllDataListApi()
    }
    catch (_) {
      dataList.value = []
    }
    finally {
      loading.value = false
    }
    return dataList.value
  }

  return {
    loading,
    dataList,
    selectedId,
    queryDataList,
  }
}
