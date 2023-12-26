import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, _, next) => {
      // 未登录用户 前往 用户中心，
      // 登录用户 前往 登录/注册
      const { path } = to
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
