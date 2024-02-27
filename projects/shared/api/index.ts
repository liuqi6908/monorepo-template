import axios from 'axios'
import { authToken } from '../composables/user'

const $http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

/**
 * 请求拦截器
 */
$http.interceptors.request.use(
  (config) => {
    const { headers, url = '' } = config
    if (authToken.value && !headers.Authorization)
      headers.Authorization = `Bearer ${authToken.value.trim()}`

    const baseURLWhiteList = ['http', '//']
    if (baseURLWhiteList.some(prefix => url.startsWith(prefix)))
      config.baseURL = ''

    if (url.startsWith('_/') || url.startsWith('/_/')) {
      config.url = url.slice(2)
      config.baseURL = ''
    }

    return config
  },
)

/**
 * 响应拦截器
 */
$http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { response } = error

    if (!response)
      return

    return Promise.reject(error)
  },
)

export { $http }
