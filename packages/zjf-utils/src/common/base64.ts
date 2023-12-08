/**
 * base64编码
 * @param str 字符串
 * @returns 编码后的字符串
 */
export function base64Encode(str: string) {
  const isBrowser = typeof window !== 'undefined'
  if (isBrowser)
    return window.btoa(str)
  else
    return Buffer.from(str).toString('base64')
}

/**
 * base64解码
 * @param str 字符串
 * @returns 解码后的字符串
 */
export function base64Decode(str: string) {
  const isBrowser = typeof window !== 'undefined'
  if (isBrowser) {
    return window.atob(str)
  } else {
    return Buffer.from(str, 'base64').toString()
  }
}