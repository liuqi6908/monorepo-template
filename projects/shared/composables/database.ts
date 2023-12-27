import { ref } from 'vue'
import { MinioBucket } from 'zjf-types'
import type { IDataDirectory } from 'zjf-types'
import { getDataByDataRootIdApi, getRootListApi } from '../api/data'
import { getFolderFilesApi } from '../api/file'
import type { FileItem } from '../types/file.interface'

/** 数据大类 */
const rootList = ref<IDataDirectory[]>()
/** 当前数据大类的ID */
const rootId = ref<string>()

/** 数据大类中的数据 */
const rootData = ref<IDataDirectory[]>()
/** 数据大类中所有的下载文件 */
const downloadFiles = ref<string[]>()
/** 数据大类中所有的样例文件 */
const previewFiles = ref<string[]>()

/** 当前数据库的ID */
const databaseId = ref<string>()

export function useDatabase() {
  /**
   * 获取所有数据大类
   */
  async function getRootList() {
    try {
      rootList.value = await getRootListApi()
    }
    catch (_) {}
  }

  /**
   * 获取指定分类的数据
   */
  async function getDataByRootId(id?: string, isFile = false) {
    rootData.value = []
    if (id) {
      try {
        rootData.value = (await getDataByDataRootIdApi(id))[0]?.children || []
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
    }
  }

  return {
    rootList,
    rootId,
    rootData,
    downloadFiles,
    previewFiles,
    databaseId,
    getRootList,
    getDataByRootId,
  }
}
