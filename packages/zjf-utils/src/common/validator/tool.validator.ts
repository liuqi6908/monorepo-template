/**
 * 校验字符串是否以数字开头
 * @param str 待校验的字符串
 * @returns
 */
export function isStartWithNumber(str: string) {
  return /^\d/.test(str)
}

/**
 * 校验字符串包含大小写字母、数字和特殊字符中的几种
 * @param str 待校验的字符串
 */
export function checkString(str: string) {
  let count = 0
  if (/[A-Z]/.test(str))
    count++
  if (/[a-z]/.test(str))
    count++
  if (/[0-9]/.test(str))
    count++
  if (/[^\w\s]/.test(str))
    count++
  return count
}
