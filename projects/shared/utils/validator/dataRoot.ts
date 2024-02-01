/**
 * 校验数据资源ID
 */
export function validateDataRootId(val?: string) {
  if (!val)
    return '请输入资源ID'
  if (val.length > 20)
    return '资源ID长度不得大于 20 位'
  if (/^[^A-Za-z]/.test(val))
    return '资源ID必须以字母开头'

  // 检测特殊字符
  const specialChars = val.split('').filter(char => !/[a-zA-Z0-9]/.test(char))
  const notAllowedChar = specialChars.find(char => !'_'.includes(char))
  if (notAllowedChar)
    return `特殊字符 “${notAllowedChar}” 不被允许`
  return ''
}

/**
 * 校验数据资源中文名
 */
export function validateDataRootNameZh(val?: string) {
  if (!val)
    return '请输入资源中文名'
  if (val.length > 20)
    return '资源中文名长度不得大于 20 位'
  return ''
}
