/**
 * 隐藏敏感信息
 * @param info 需处理的信息（邮箱/身份证号）
 * @returns 隐藏后的信息
 */
export function hideSensitiveInfo(info?: string) {
  let result = ''

  // 邮箱
  if (info?.includes('@')) {
    const atIndex = info.indexOf('@')
    if (atIndex) {
      const username = info.slice(0, atIndex)
      const domain = info.slice(atIndex + 1)
      let hiddenUsername
      if (atIndex > 4)
        hiddenUsername = username.slice(0, 3) + '*'.repeat(username.length - 3)
      else if (atIndex > 2 && atIndex <= 4)
        hiddenUsername = username.slice(0, 2) + '*'.repeat(username.length - 2)
      else
        hiddenUsername = `${username.slice(0, 1)}*`
      result = `${hiddenUsername}@${domain}`
    }
  }
  // 身份证号
  else if (info && info.length > 7) {
    result = `${info.slice(0, 3)}${'*'.repeat(info.length - 7)}${info.slice(info.length - 4)}`
  }

  return result || info
}
