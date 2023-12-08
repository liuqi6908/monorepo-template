/**
 * 校验路径并修复其中的错误
 * @param url 路径
 * @return 修复后的路径（去除重复的 `/`）
 */
export function validatePath(url: string) {
  // 判断是否是带有协议的路径
  const withProtocol = url.indexOf('://') > -1
  const protocol = withProtocol ? url.split('://')[0] : ''
  const uri = withProtocol ? url.split('://')[1] : url

  // 去除多余的斜杠
  let path = uri.charAt(0) !== '/' ? '/' + url : url
  path = path.replace(/\/{2,}/g, '/')
  return protocol ? `${protocol}://${path.slice(1)}` : path
}
