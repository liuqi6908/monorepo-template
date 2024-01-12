import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, _, next) => {
      const { path } = to

      // 前往登录页面，移除前导页
      if (path.startsWith('/auth'))
        localStorage.removeItem(LEADING_PAGE_KEY)

      const isLogin = !!authToken.value
      // 重定向到登录页
      if (
        // 未登录用户 前往 非登录/注册页
        !path.startsWith('/auth') && !isLogin
      )
        next('/auth')
      // 重定向到首页
      else if (
        // 登录用户 前往 登录/注册页
        path.startsWith('/auth') && isLogin
      )
        next('/')
      else
        next()
    })
  }
}
