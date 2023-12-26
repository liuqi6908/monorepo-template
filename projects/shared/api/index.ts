import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { ErrorCode } from 'zjf-types'
import { API_BASE_URL } from '../constants/app'
import { useApp } from '../composables/app'
import { adminRole } from '../composables/permission'
import { authToken } from '../composables/token'
import { userInfo } from '../composables/userInfo'

const $http = axios.create({
  baseURL: API_BASE_URL,
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
    const { config, response } = error

    if (!response)
      return

    const { status, detail, message } = response.data
    const notify = config.headers.notify !== false

    // 判断登录是否有效（未登录/登录过期）
    if (response.status === 401) {
      authToken.value = ''
      adminRole.value = []
      userInfo.value = undefined
    }

    const { isAdmin } = useApp()
    // 管理后台，跳转路由
    if (isAdmin.value) {
      const $router = useRouter()
      // 判断是否有权限
      if (status === ErrorCode.PERMISSION_DENIED)
        $router.replace({ path: '/denied' })
      // 判断登录是否有效
      else if (response.status === 401)
        $router.replace({ path: '/auth/login' })
    }

    if (notify) {
      if (Array.isArray(detail)) {
        detail.forEach(item =>
          showNotify(item.message),
        )
      }
      else if (detail) {
        showNotify(detail)
      }
      else {
        showNotify(message)
      }
    }

    return Promise.reject(error)
  },
)

/**
 * 展示错误通知
 * @param message
 */
function showNotify(message: string) {
  Notify.create({
    type: 'danger',
    message,
  })
}

export { $http }
