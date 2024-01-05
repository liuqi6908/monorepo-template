import buffer from 'node:buffer'

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
    return buffer.Buffer.from(str).toString('base64')
}
