/** image 文件后缀 */
export const IMAGE_FILE_SUFFIX = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico']

/**
 * 判断是否为image文件
 * @param file 待判断的文件/文件名
 * @returns 是否为image文件
 */
export function isImage(file: File | string) {
  const name = typeof file === 'string' ? file : file.name
  const suffix = name.split('.').pop()?.toLowerCase()
  if (suffix && IMAGE_FILE_SUFFIX.includes(suffix))
    return true
}
