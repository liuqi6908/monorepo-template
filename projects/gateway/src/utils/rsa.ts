import * as NodeRSA from 'node-rsa'

/**
 * 对字符串进行rsa加密
 */
export function rsaEncrypt(password: string, publicKey = process.env.VITE_PUBLIC_KEY, key = 'zjfUsO') {
  const rsa = new NodeRSA()
  rsa.setOptions({ encryptionScheme: 'pkcs1' })
  rsa.importKey(publicKey, 'pkcs8-public')
  return rsa.encrypt(
    `${key}${password.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('')}`,
    'base64',
  )
}

/**
 * 对密文进行rsa解密
 */
export function rsaDecrypt(hash: string, privateKey = process.env.VITE_PRIVATE_KEY, key = 'zjfUsO') {
  try {
    const rsa = new NodeRSA()
    rsa.setOptions({ encryptionScheme: 'pkcs1' })
    rsa.importKey(privateKey, 'pkcs8-private')
    const str = rsa.decrypt(hash, 'utf8')
    if (!str)
      return hash
    return str.replace(key, '').split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('')
  }
  catch (_) {
    return hash
  }
}
