import type { Repository } from 'typeorm'

/**
 * 批量保存实体对象
 * @param repo 实体存储库
 * @param list 实体对象列表
 * @param idKey 标识属性的键
 * @param chunkSize 切片大小 `50`
 * @param restore 失败时进行恢复 `false`
 * @returns 保存的数量
 */
export async function batchSave<T>(
  repo: Repository<T>,
  list: T[],
  idKey: keyof T,
  chunkSize = 50,
  restore = false,
) {
  const chunks = list.reduce((acc, cur) => {
    const lastChunk = acc[acc.length - 1]
    if (lastChunk.length < chunkSize)
      lastChunk.push(cur)
    else
      acc.push([cur])
    return acc
  }, [[]] as T[][])

  for (const chunk of chunks) {
    try {
      await repo.save(chunk.map((c) => {
        return restore
          ? { ...c, deletedAt: null }
          : c
      }))
    }
    catch (e) {
      restore && await repo.restore(chunk.map(c => c[idKey] as string))
    }
  }

  return list.length
}
