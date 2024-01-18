import type { UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, from, next) => {
      const { path } = to

      // 前往登录页面，记录前导页
      if (from.name && !from.path.startsWith('/auth') && path.startsWith('/auth'))
        localStorage.setItem(LEADING_PAGE_KEY, from.fullPath)

      // 重定向到首页
      const isLogin = !!authToken.value
      if (
        // 未登录用户 前往 用户中心
        (path.startsWith('/userCenter') && !isLogin)
        // 登录用户 前往 登录/注册页
        || (path.startsWith('/auth') && isLogin)
        // 用户中心功能划分
        || USER_MENU_LIST.find(v => v.to === path)?.config === false
      )
        next('/')
      else
        next()
    })
  }
}
