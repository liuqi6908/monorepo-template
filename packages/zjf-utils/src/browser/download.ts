/**
 * 下载csv文件
 * @param csvRaw csv文件内容
 * @param name 文件名
 */
export function downloadCsv(csvRaw: string, name?: string) {
  const url = `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(csvRaw)}`
  downloadUrl(url, name)
}

/**
 * 下载指定的链接
 * @param url 链接
 * @param name 文件名
 */
export function downloadUrl(url: string, name = '未命名文件') {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
}
