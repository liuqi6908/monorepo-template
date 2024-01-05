import { base64Decode } from '../base64'

/**
 * 解密 http 请求中的密码
 * @param hash 密文
 * @param key 秘钥
 * @default key zjfUsO
 * @returns 解密后的密码
 */
export function decryptPasswordInHttp(hash: string, key = 'zjfUsO') {
  const base64Decoded = base64Decode(hash)
  if (!base64Decoded.startsWith(key))
    return hash
  return base64Decode(hash).replace(key, '').split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('')
}
