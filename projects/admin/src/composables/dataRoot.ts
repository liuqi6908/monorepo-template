import { Notify } from 'quasar'
import { MinioBucket, UploadType } from 'zjf-types'
import type { IDataDirectory, IUploadTableDataParamDto } from 'zjf-types'

export type Resource = Record<
  IDataDirectory['id'],
  string[]
>

/** 加载中 */
const loading = ref(false)

/** 数据资源列表 */
const dataList = ref<IDataDirectory[]>()
/** 当前选中的数据资源ID */
const selectedId = ref<IDataDirectory['id']>()

/** 数据资源预览数据上传情况 */
const previewResource = ref<Resource>({})
/** 数据资源下载数据上传情况 */
const downloadResource = ref<Resource>({})

export function useDataRoot() {
  const { uploadFile } = useMinio()

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

  /**
   * 根据路径返回文件名
   */
  function getFileNames(arr: { name: string }[]) {
    return arr.map(({ name }) => {
      const path = name.split('/')
      return {
        key: path[1],
        name: path.pop()?.split('.').shift(),
      }
    }).filter(v => v.key && v.name)
  }

  /**
   * 获取预览数据上传情况
   */
  async function getPreviewUploadStatus() {
    previewResource.value = {}

    const res = getFileNames(
      await getFolderFilesApi({
        bucket: MinioBucket.DATA,
        path: 'preview',
      }) ?? [],
    )
    res.forEach((v) => {
      if (!previewResource.value[v.key])
        previewResource.value[v.key] = []
      previewResource.value[v.key].push(v.name!)
    })
  }

  /**
   * 获取下载数据上传情况
   */
  async function getDownloadUploadStatus() {
    downloadResource.value = {}

    const res = getFileNames(
      await getFolderFilesApi({
        bucket: MinioBucket.DATA,
        path: 'download',
      }) ?? [],
    )
    res.forEach((v) => {
      if (!downloadResource.value[v.key])
        downloadResource.value[v.key] = []
      downloadResource.value[v.key].push(v.name!)
    })
  }

  /**
   * 上传表格 预览/下载 数据
   */
  async function uploadTableData(param: IUploadTableDataParamDto, file: File, notify = true) {
    const { filename, dataRootId, uploadType } = param
    const ext = filename.split('.').pop()
    if (
      (uploadType === UploadType.PREVIEW && ext !== 'csv')
      || (uploadType === UploadType.DOWNLOAD && ext !== 'zip')
    ) {
      const message = '文件类型不允许'
      if (notify) {
        Notify.create({
          type: 'danger',
          message,
        })
      }
      throw new Error(message)
    }

    const path = `${uploadType}/${dataRootId}/${filename}`
    await uploadFile(MinioBucket.DATA, path, file)
    return filename
  }

  return {
    loading,
    dataList,
    selectedId,
    previewResource,
    downloadResource,
    queryDataList,
    getPreviewUploadStatus,
    getDownloadUploadStatus,
    uploadTableData,
  }
}
