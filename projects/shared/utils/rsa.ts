import JSEncrypt from 'jsencrypt'

const rsa = new JSEncrypt()

/**
 * 对字符串进行rsa加密
 */
export function rsaEncrypt(
  password: string,
  publicKey: string = import.meta.env.VITE_PUBLIC_KEY ?? '',
  key = 'zjfUsO',
) {
  rsa.setPublicKey(publicKey)
  const encryptData = rsa.encrypt(
    `${key}${password.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('')}`,
  )
  if (!encryptData)
    return password
  else
    return encryptData
}

/**
 * 对密文进行rsa解密
 */
export function rsaDecrypt(
  hash: string,
  privateKey: string = import.meta.env.VITE_PRIVATE_KEY ?? '',
  key = 'zjfUsO',
) {
  try {
    rsa.setPrivateKey(privateKey)
    const str = rsa.decrypt(hash)
    if (!str)
      return hash
    return str.replace(key, '').split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('')
  }
  catch (_) {
    return hash
  }
}
