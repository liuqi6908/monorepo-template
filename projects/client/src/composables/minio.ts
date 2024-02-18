import $http from 'axios'
import { createClient } from 'minio-vite-js'
import { browser } from 'zjf-utils'
import type { AxiosRequestConfig } from 'axios'
import type { QNotifyUpdateOptions } from 'quasar'

/** FTP 文件上传桶名 */
const bucket = import.meta.env.VITE_MINIO_BUCKET_FTP ?? ''

export function useMinio() {
  const { userInfo } = useUser()
  const { desktopInfo } = useDesktop()

  /**
   * 获取Minio客户端
   */
  function getClient() {
    const { isDesktop } = useUser()
    const endPoint = isDesktop.value ? import.meta.env.VITE_MINIO_ENDPOINT_INTERNAL : import.meta.env.VITE_MINIO_ENDPOINT_EXTERNAL
    return createClient({
      endPoint,
      port: getEnvVariable('VITE_MINIO_PORT'),
      useSSL: getEnvVariable('VITE_MINIO_USE_SSL', false),
      accessKey: import.meta.env.VITE_MINIO_AK ?? '',
      secretKey: import.meta.env.VITE_MINIO_SK ?? '',
    })
  }

  /**
   * 基础路径
   */
  const basePath = computed(() => `${desktopInfo.value?.id}/${userInfo.value?.account}/`)

  /**
   * 上传文件
   */
  async function uploadFile(file: File, notify: (props?: QNotifyUpdateOptions | undefined) => void) {
    // 获取临时上传的预签名 URL
    const url = await getClient().presignedUrl('put', bucket, `${basePath.value}${file.name}`, 60)

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
    return await getClient().removeObjects(bucket, names)
  }

  /**
   * 下载文件
   */
  async function downloadFile(path: string) {
    // 获取临时下载的预签名 URL
    const url = await getClient().presignedUrl('get', bucket, path, 60)
    browser.downloadUrl(url, path.split('/').pop())
  }

  return {
    basePath,
    getClient,
    uploadFile,
    deleteFile,
    downloadFile,
  }
}
