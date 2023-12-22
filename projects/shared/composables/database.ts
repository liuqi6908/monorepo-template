import { ref } from 'vue'
import { MinioBucket } from 'zjf-types'
import type { IDataDirectory } from 'zjf-types'
import { getDataByDataRootIdApi, getRootListApi } from '../api/data'
import { getFolderFilesApi } from '../api/file'
import type { FileItem } from '../types/file.interface'

interface Node extends IDataDirectory {
  preview?: boolean
  download?: boolean
  children?: Node[]
}

/** 数据大类 */
const rootList = ref<IDataDirectory[]>([])
/** 加载中 */
const loading = ref(false)

/** 数据大类中的数据 */
const rootData = ref<Node[]>()
/** 数据大类中所有的下载文件 */
const downloadFiles = ref<string[]>([])
/** 数据大类中所有的样例文件 */
const previewFiles = ref<string[]>([])

export function useDatabase() {
  /**
   * 获取所有数据大类
   */
  async function getRootList() {
    loading.value = true
    try {
      rootList.value = await getRootListApi()
    }
    catch (_) {}
    finally {
      loading.value = false
    }
  }

  /**
   * 获取指定分类的数据
   */
  async function getDataByRootId(id: string, isFile = false) {
    rootData.value = []
    if (id) {
      loading.value = true
      try {
        rootData.value = await getDataByDataRootIdApi(id)
        if (isFile && rootData.value[0]?.children?.length) {
          const _getFileNames = (arr: FileItem[]) => {
            return arr.map(({ name }) => {
              return name.split('/').pop()?.split('.').shift() || ''
            }).filter(v => v)
          }

          downloadFiles.value = _getFileNames(await getFolderFilesApi({
            bucket: MinioBucket.DATA,
            path: `download/${id}`,
          }))
          previewFiles.value = _getFileNames(await getFolderFilesApi({
            bucket: MinioBucket.DATA,
            path: `preview/${id}`,
          }))
        }
      }
      catch (_) {}
      finally {
        loading.value = false
      }
    }
  }

  return {
    rootList,
    loading,
    rootData,
    downloadFiles,
    previewFiles,
    getRootList,
    getDataByRootId,
  }
}
