import { base64Decode, base64Encode } from '../base64'

/**
 * 在 http 请求中加密密码
 * @param password 密码
 * @param key 秘钥
 * @returns 加密后的密码
 */
export function encryptPasswordInHttp(password: string, key = 'zjfUsO') {
  return base64Encode(
    `${key}${password.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('')}`
  )
}

/**
 * 解密 http 请求中的密码
 * @param hash 密文
 * @param key 秘钥
 * @returns 解密后的密码
 */
export function decryptPasswordInHttp(hash: string, key = 'zjfUsO') {
  const base64Decoded = base64Decode(hash)
  if (!base64Decoded.startsWith(key))
    return hash
  return base64Decode(hash).replace(key, '').split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('')
}
