import $http from 'axios'
import { browser } from 'zjf-utils'
import { MinioBucket } from 'zjf-types'
import type { AxiosRequestConfig } from 'axios'
import type { QNotifyUpdateOptions } from 'quasar'

export function useFtp() {
  const { userInfo } = useUser()
  const { desktopInfo } = useDesktop()
  const { batchDeleteFiles, signUploadLink, signDownloadLink } = useMinio()

  /**
   * 基础路径
   */
  const basePath = computed(() => `${desktopInfo.value?.id}/${userInfo.value?.account}/`)

  /**
   * 上传文件
   */
  async function uploadFile(file: File, notify: (props?: QNotifyUpdateOptions | undefined) => void) {
    // 获取临时上传的预签名 URL
    const url = await signUploadLink(MinioBucket.FTP, `${basePath.value}${file.name}`)

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
   * 下载文件
   */
  async function downloadFile(path: string) {
    // 获取临时下载的预签名 URL
    const url = await signDownloadLink(MinioBucket.FTP, path)
    browser.downloadUrl(url, path.split('/').pop())
  }

  /**
   * 删除文件
   */
  async function deleteFile(paths: string[]) {
    return await batchDeleteFiles(MinioBucket.FTP, paths)
  }

  return {
    basePath,
    uploadFile,
    downloadFile,
    deleteFile,
  }
}
