import { parseBoolRaw, parseIntRaw } from 'utils'

/**
 * 辅助函数，用于根据传入的变量名获取环境变量并进行类型转换
 * @param name 变量名
 * @param defaultValue 默认值
 * @returns 转换后的环境变量
 */
export function getEnvVariable<T extends keyof Env, V extends Env[T]>(
  name: T, defaultValue?: V,
): V extends undefined ? Env[T] : Exclude<Env[T], undefined> {
  const value = import.meta.env[name]
  if (!value)
    return defaultValue as any

  // 进行类型转换
  if (typeof parseIntRaw(value) === 'number')
    return parseIntRaw(value) as any
  else if (typeof parseBoolRaw(value) === 'boolean')
    return parseBoolRaw(value) as any

  return value as any
}
