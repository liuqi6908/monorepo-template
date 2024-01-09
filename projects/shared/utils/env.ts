import { parseBoolRaw } from 'zjf-utils'

/**
 * 辅助函数，用于根据传入的变量名获取环境变量并进行类型转换
 * @param name 变量名
 * @param defaultValue 默认值
 * @returns 转换后的环境变量
 */
export function getEnvVariable<T extends keyof ImportMetaEnv, S extends ImportMetaEnv[T]>(
  name: T, defaultValue?: S,
): S {
  const value = (import.meta as any).env[name]
  if (!value)
    return defaultValue as S

  // 进行类型转换
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')
      return parseBoolRaw(value.toLowerCase()) as S
    else if (!Number.isNaN(Number(value)))
      return Number(value) as S
  }

  return value as S
}
