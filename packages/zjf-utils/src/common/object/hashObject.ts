import md5 from 'blueimp-md5'

/**
 * 对传入的对象进行排序并计算其MD5哈希值
 * @param obj 待处理的对象
 * @returns MD5哈希值
 */
export function hashObject(obj: unknown) {
  return md5(JSON.stringify(sortObj(obj)))
}

function sortObj(obj: any): any {
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return (obj as Array<any>).sort().map(el => sortObj(el))
  }
  else if (Object.prototype.toString.call(obj) === '[object Object]') {
    const keys = Object.keys(obj).sort()
    return keys.reduce((prev, curr) => {
      prev[curr] = sortObj(obj[curr])
      return prev
    }, {} as any)
  }
  else {
    return obj
  }
}
