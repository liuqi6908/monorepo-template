const { $get } = useRequest()

/**
 * 判断当前客户端是否在云桌面内使用
 * @returns
 */
export function is() {
  return $get<boolean>('desktop/is')
}
