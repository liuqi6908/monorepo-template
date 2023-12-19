/**
 * 文件 转 FormData
 * @param file 文件
 * @returns FormData
 */
export function file2FormData(file: File) {
  const fromData = new FormData()
  fromData.append('file', file)
  return fromData
}
