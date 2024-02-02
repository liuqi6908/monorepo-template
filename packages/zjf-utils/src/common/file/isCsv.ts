/** csv 文件类型 */
export const CSV_FILE_TYPE = ['text/csv', 'application/vnd.ms-excel']

/**
 * 判断是否为CSV文件
 * @param file 待判断的文件
 * @returns 是否为CSV文件
 */
export function isCsv(file: File) {
  const { name, type } = file
  if (CSV_FILE_TYPE.includes(type) && name.split('.').pop() === 'csv')
    return true
}
