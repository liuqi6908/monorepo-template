import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, from, next) => {
      const { path } = to
      // 前往登录页面，记录前导页
      if (from.name && !from.path.startsWith('/auth') && path.startsWith('/auth'))
        localStorage.setItem(LEADING_PAGE_KEY, from.fullPath)
      // 未登录用户 前往 用户中心，
      // 登录用户 前往 登录/注册
      const isLogin = !!authToken.value
      if (
        (path.startsWith('/userCenter') && !isLogin)
        || (path.startsWith('/auth') && isLogin)
      )
        next('/')
      else
        next()
    })
  }
}
