/**
 * 判断是否为压缩文件
 * @param file 待判断的文件
 */
export function isCompressedFile(file: File) {
  const { type, name } = file
  const suffix = name.split('.').pop()?.toLocaleLowerCase()
  const allowedTypes = ['zip', 'rar', '7z', 'tar', 'xz', 'gz', 'tgz', 'lzh', 'iso']
  for (const key of allowedTypes) {
    if (type.includes(key) || suffix === key)
      return true
  }
  return false
}
