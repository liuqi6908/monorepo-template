export const NAME_ZH_MAX_LENGTH = 20
export const NAME_ZH_REQUIREMENTS_DESC = `中文名长度不得大于 ${NAME_ZH_MAX_LENGTH} 位`

/**
 * 校验一个资源中文名是否符合要求
 * @param name 待校验的资源中文名
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validateNameZh(name: string) {
  if (!name)
    return '请输入中文名'
  if (name.length > NAME_ZH_MAX_LENGTH)
    return `中文名长度不得大于 ${NAME_ZH_MAX_LENGTH}`
  return ''
}
