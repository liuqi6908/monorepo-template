/**
 * 校验权限名称
 */
export function validateAdminRoleName(val?: string) {
  if (!val)
    return '请输入权限名称'
  if (val.length > 10)
    return '权限名称长度不得大于 10 位'
  return ''
}

/**
 * 校验权限名称描述
 */
export function validateAdminRoleDesc(val?: string) {
  if (val && val.length > 200)
    return '描述长度不得大于 200 位'
  return ''
}
