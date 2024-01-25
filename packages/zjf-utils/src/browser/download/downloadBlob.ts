import { downloadUrl } from './downloadUrl'

/**
 * 将Blob二进制文件流内容下载到本地
 * @param stream Blob二进制文件流
 * @param name 文件名
 */
export function downloadBlob(stream: Blob, name?: string) {
  const blob = new Blob([stream], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  downloadUrl(url, name)
  URL.revokeObjectURL(url)
}
