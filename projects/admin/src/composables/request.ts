import type { AxiosRequestConfig } from 'axios'
import $http from '~/api'

const cache = new Map<string, any>()

export function useRequest() {
  const requestControllers = new Set<AbortController>()

  onBeforeUnmount(() => {
    abortAll()
  })

  function newController() {
    const abortController = new AbortController()
    const signal = abortController.signal
    requestControllers.add(abortController)
    return { abortController, signal }
  }

  function abort(controller: AbortController) {
    if (requestControllers.has(controller)) {
      controller.abort()
      requestControllers.delete(controller)
    }
  }

  function abortAll() {
    for (const controller of requestControllers)
      abort(controller)
  }

  //   function loadingWrapper<T>(promise: Promise<T>) {
  //     const loading = ref(true)
  //     promise.finally(() => loading.value = false)
  //     return { loading, data: promise }
  //   }

  async function $get(url: string, options?: AxiosRequestConfig, useCache = false) {
    const cacheKey = url + JSON.stringify(options)
    if (useCache && cache.has(cacheKey))
      return cache.get(cacheKey)

    const { signal, abortController } = newController()
    const response = await $http.get(url, { signal, ...(options || {}) })
    requestControllers.delete(abortController)
    useCache && cache.set(cacheKey, response.data)
    return response.data
  }

  async function $post(url: string, data: any, config?: AxiosRequestConfig, useCache = false) {
    const cacheKey = url + JSON.stringify(data) + JSON.stringify(config)
    if (useCache && cache.has(cacheKey))
      return cache.get(cacheKey)
    const { signal, abortController } = newController()
    const response = await $http.post(url, data, { signal, ...(config || {}) })
    requestControllers.delete(abortController)
    useCache && cache.set(cacheKey, response.data)
    return response.data
  }

  return { $get, $post }
}