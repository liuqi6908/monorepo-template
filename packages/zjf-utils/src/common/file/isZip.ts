/** zip 文件类型 */
export const ZIP_FILE_TYPE = ['application/zip', 'application/x-zip-compressed']

/**
 * 判断是否为ZIP文件
 * @param file 待判断的文件
 * @returns 是否为ZIP文件
 */
export function isZip(file: File) {
  const { name, type } = file
  if (ZIP_FILE_TYPE.includes(type) && name.split('.').pop() === 'zip')
    return true
}
