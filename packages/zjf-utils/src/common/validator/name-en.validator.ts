export const NAME_EN_MAX_LENGTH = 50
export const NAME_EN_ALLOW_CHARS = '_-'
export const NAME_EN_REQUIREMENTS_DESC = `英文名长度不得大于 ${NAME_EN_MAX_LENGTH} 位，由大小写字母、数字及特殊字符 ${NAME_EN_ALLOW_CHARS} 组成，且必须以字母开头`

/**
 * 校验一个资源英文名是否符合要求
 * @param name 待校验的资源英文名
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validateNameEn(name: string) {
  if (!name)
    return '请输入英文名'
  if (/^[^A-Za-z]/.test(name))
    return '英文名必须以字母开头'
  if (name.length > NAME_EN_MAX_LENGTH)
    return `英文名长度不得大于 ${NAME_EN_MAX_LENGTH}`

  // 检测特殊字符
  const specialChars = name.split('').filter(char => !/[a-zA-Z0-9]/.test(char))
  const notAllowedChar = specialChars.find(char => !NAME_EN_ALLOW_CHARS.includes(char))
  if (notAllowedChar)
    return `特殊字符 “${notAllowedChar}” 不被允许`
  return ''
}
