import $http from 'axios'
import { createClient } from 'minio-vite-js'
import { browser } from 'zjf-utils'
import type { AxiosRequestConfig } from 'axios'
import type { QNotifyUpdateOptions } from 'quasar'

/** MinIo 客服端 */
const client = createClient({
  endPoint: import.meta.env.VITE_MINIO_ENDPOINT ?? 'localhost',
  port: getEnvVariable('VITE_MINIO_PORT'),
  useSSL: getEnvVariable('VITE_MINIO_USE_SSL', false),
  accessKey: import.meta.env.VITE_MINIO_AK ?? '',
  secretKey: import.meta.env.VITE_MINIO_SK ?? '',
})
/** FTP 文件上传桶名 */
const bucket = import.meta.env.VITE_MINIO_BUCKET_FTP ?? ''

export function useMinio() {
  const { userInfo } = useUser()

  /**
   * 基础路径
   */
  const basePath = computed(() => `${userInfo.value?.account}/`)

  /**
   * 上传文件
   */
  async function uploadFile(file: File, notify: (props?: QNotifyUpdateOptions | undefined) => void) {
    // 获取临时上传的预签名 URL
    const url = await client.presignedUrl('put', bucket, `${basePath.value}${file.name}`, 60)

    // 使用 Axios 上传文件，并监听上传进度
    const config: AxiosRequestConfig = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(progressEvent.loaded / (progressEvent.total ?? 1) * 100)
        notify({
          caption: `上传进度：${percentCompleted}%`,
        })
      },
    }

    return await $http.put(url, file, config)
  }

  /**
   * 删除文件
   */
  async function deleteFile(names: string[]) {
    return await client.removeObjects(bucket, names)
  }

  /**
   * 下载文件
   */
  async function downloadFile(path: string, notify: (props?: QNotifyUpdateOptions | undefined) => void) {
    // 获取临时下载的预签名 URL
    const url = await client.presignedUrl('get', bucket, path, 60)

    // 使用 Axios 下载文件，并监听下载进度
    const config: AxiosRequestConfig = {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(progressEvent.loaded / (progressEvent.total ?? 1) * 100)
        notify({
          caption: `下载进度：${percentCompleted}%`,
        })
      },
    }

    const { data } = await $http.get(url, config)
    const downloadUrl = URL.createObjectURL(new Blob([data]))
    browser.downloadUrl(downloadUrl, path.split('/').pop())
    URL.revokeObjectURL(downloadUrl)
  }

  return {
    client,
    uploadFile,
    deleteFile,
    downloadFile,
  }
}
