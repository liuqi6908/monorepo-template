/**
 * 格式化文件尺寸
 * @param bytes 
 * @returns 
 */
export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const v = (bytes / Math.pow(k, i)).toFixed(2)
  return `${Number(v)} ${sizes[i]}`
}