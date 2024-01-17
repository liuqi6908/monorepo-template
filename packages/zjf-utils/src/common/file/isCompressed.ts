/** 压缩文件后缀 */
export const COMPRESSED_FILE_SUFFIX = ['zip', 'rar', '7z', 'tar', 'xz', 'gz', 'tgz', 'lzh', 'iso']

/**
 * 判断指定文件是否为压缩文件
 * @param file 待判断的文件
 * @returns 是否为压缩文件
 */
export function isCompressedFile(file: File) {
  const { name } = file
  const suffix = name.split('.').pop()?.toLowerCase() ?? ''
  return COMPRESSED_FILE_SUFFIX.includes(suffix)
}
