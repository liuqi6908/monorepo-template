import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { ErrorCode } from 'zjf-types'
import { VITE_API_BASE } from '../constants'
import { authToken, adminRole, userInfo, useApp } from '../composables'

const $http = axios.create({
  baseURL: VITE_API_BASE,
})
const $router = useRouter()
const { isAdmin } = useApp()

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
  }
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

    // 管理后台，跳转路由
    if (isAdmin.value) {
      // 判断是否有权限
      if (status === ErrorCode.PERMISSION_DENIED)
        $router.replace({ path: '/denied' })
      // 判断登录是否有效
      else if (response.status === 401)
        $router.replace({ path: '/auth/login' })
    }

    if (notify) {
      if (Array.isArray(detail)) {
        detail.forEach((item) =>
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
    message
  })
}

export default $http

// 导出所有接口
export * from './auth'
export * from './cms'
export * from './config'
export * from './data'
export * from './dataPermission'
export * from './dataSuggest'
export * from './desktop'
export * from './desktopHost'
export * from './desktopRequest'
export * from './desktopVm'
export * from './email'
export * from './exportLg'
export * from './exportSm'
export * from './file'
export * from './log'
export * from './role'
export * from './user'
export * from './verification'
export * from './work'