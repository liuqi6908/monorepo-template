/**
 * 判断两个数组是否有交集
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 两个数组是否有交集
 */
export function hasIntersection(arr1: any[], arr2: any[]) {
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)

  for (const item of set1) {
    if (set2.has(item))
      return true
  }

  return false
}

/**
 * 展开数组
 * @param arr 任意二维数组
 * @returns 展开后的数组
 */
export function expandArray(arr: any[][]) {
  if (Array.isArray(arr))
    return arr.reduce((a, b) => a.concat(b), [])
  return []
}
