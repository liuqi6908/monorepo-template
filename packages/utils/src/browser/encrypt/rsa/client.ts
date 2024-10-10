let rsa: JSEncrypt | undefined

/**
 * 获取 RSA 实例
 */
export async function getRsaClient() {
  if (window && !rsa) {
    try {
      const JSEncrypt = (await import('jsencrypt/bin/jsencrypt.min.js')).default
      rsa = new JSEncrypt()
    }
    catch (_) {
      rsa = undefined
    }
  }
  return rsa
}
