import type { AxiosRequestConfig } from 'axios'

import { $http } from '../api'

type QueryParams = string | Record<string | number, string | number | boolean | undefined | null>

/** 请求缓存 */
const cache = new Map<string, any>()

export function useRequest() {
  const requestControllers = new Set<AbortController>()

  function newController() {
    const abortController = new AbortController()
    const signal = abortController.signal
    requestControllers.add(abortController)
    return { abortController, signal }
  }

  function queryParamsUrl(url: string, query: QueryParams) {
    const queryParams = new URLSearchParams(query as any)
    return `${url}?${queryParams.toString()}`
  }

  async function $get<T = any>(
    url: string,
    query?: any,
    isResponseData = true,
    config?: AxiosRequestConfig,
    useCache = false,
  ): Promise<T> {
    const cacheKey = `${url}${JSON.stringify(query)}${isResponseData}${JSON.stringify(config)}`
    if (useCache && cache.has(cacheKey))
      return cache.get(cacheKey)

    const { signal, abortController } = newController()
    if (query)
      url = queryParamsUrl(url, query)

    const response = await $http.get(url, { signal, ...(config || {}) })
    requestControllers.delete(abortController)
    const data = isResponseData ? response.data : response
    useCache && cache.set(cacheKey, data)
    return data
  }

  async function $post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    useCache = false,
  ): Promise<T> {
    const cacheKey = `${url}${JSON.stringify(data)}${JSON.stringify(config)}`
    if (useCache && cache.has(cacheKey))
      return cache.get(cacheKey)

    const { signal, abortController } = newController()
    const response = await $http.post(url, data, { signal, ...(config || {}) })
    requestControllers.delete(abortController)
    useCache && cache.set(cacheKey, response.data)
    return response.data
  }

  async function $put<T = any>(
    url: string,
    data?: any,
    query?: any,
    config?: AxiosRequestConfig,
    useCache = false,
  ): Promise<T> {
    const cacheKey = `${url}${JSON.stringify(data)}${JSON.stringify(query)}${JSON.stringify(config)}`
    if (useCache && cache.has(cacheKey))
      return cache.get(cacheKey)

    const { signal, abortController } = newController()
    if (query)
      url = queryParamsUrl(url, query)

    const response = await $http.put(url, data, { signal, ...(config || {}) })
    requestControllers.delete(abortController)
    useCache && cache.set(cacheKey, response.data)
    return response.data
  }

  async function $patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    useCache = false,
  ): Promise<T> {
    const cacheKey = `${url}${JSON.stringify(data)}${JSON.stringify(config)}`
    if (useCache && cache.has(cacheKey))
      return cache.get(cacheKey)

    const { signal, abortController } = newController()
    const response = await $http.patch(url, data, { signal, ...(config || {}) })
    requestControllers.delete(abortController)
    useCache && cache.set(cacheKey, response.data)
    return response.data
  }

  async function $delete<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    useCache = false,
  ): Promise<T> {
    const cacheKey = `${url}${JSON.stringify(data)}${JSON.stringify(config)}`
    if (useCache && cache.has(cacheKey))
      return cache.get(cacheKey)

    const { signal, abortController } = newController()
    const response = await $http.delete(url, { data, signal, ...(config || {}) })
    requestControllers.delete(abortController)
    useCache && cache.set(cacheKey, response.data)
    return response.data
  }

  function $getUri(url: string, params?: any) {
    return $http.getUri({ url, params })
  }

  return { $get, $post, $put, $patch, $delete, $getUri, queryParamsUrl }
}
