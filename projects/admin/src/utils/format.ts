/**
 * 格式化文件大小
 * @param bytes 字节数
 */
export function formatFileSize(bytes: number) {
  if (!(bytes > 0))
    return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}
