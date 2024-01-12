import type { Readable } from 'node:stream'
import { Bufferfrom, createClient } from 'minio-vite-js'
import { browser } from 'zjf-utils'

const client = createClient({
  endPoint: import.meta.env.VITE_MINIO_ENDPOINT ?? 'localhost',
  port: getEnvVariable('VITE_MINIO_PORT'),
  useSSL: getEnvVariable('VITE_MINIO_USE_SSL', false),
  accessKey: import.meta.env.VITE_MINIO_AK ?? '',
  secretKey: import.meta.env.VITE_MINIO_SK ?? '',
})
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
  async function uploadFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const buf = Bufferfrom(reader.result)
        const res = client.putObject(bucket, `${basePath.value}${file.name}`, buf)
        resolve(res)
      }
      reader.onerror = () => {
        reject(reader.error)
      }
      reader.readAsArrayBuffer(file)
    })
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
  async function downloadFile(path: string) {
    loadingNotify(
      () => new Promise((resolve, reject) => {
        client.getObject(bucket, path, (err: Error | null, dataStream: Readable) => {
          if (err || !dataStream)
            return reject(err)

          // 切片，将对象数据转换为Blob
          const chunks: any[] = []
          dataStream.on('data', (chunk) => {
            chunks.push(chunk)
          })
          dataStream.on('end', () => {
            const blob = new Blob(chunks)
            const downloadUrl = URL.createObjectURL(blob)
            browser.downloadUrl(downloadUrl, path.split('/').pop())
            URL.revokeObjectURL(downloadUrl)
            resolve(downloadUrl)
          })
          dataStream.on('error', (err) => {
            reject(err)
          })
        })
      }),
      '正在下载中...',
      '下载成功',
      '文件不存在',
    )
  }

  return {
    client,
    uploadFile,
    deleteFile,
    downloadFile,
  }
}
