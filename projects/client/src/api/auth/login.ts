import type { ILoginByPasswordBodyDto, ILoginSuccessResData, IRegisterBodyDto } from 'zjf-types'

const { $post, $put } = useRequest()

/**
 * 通过 账号/邮箱 + 密码 登录
 * @param body
 * @returns
 */
export function login(body: ILoginByPasswordBodyDto) {
  return $post<ILoginSuccessResData>('/auth/login/password', body)
}

/**
 * 注册（邮箱 + 验证码）
 * @param body
 * @returns
 */
export function register(body: IRegisterBodyDto) {
  return $put<ILoginSuccessResData>('/auth/register', body)
}

/**
 * 登出
 * @returns
 */
export function logout() {
  return $post('/auth/logout', null)
}
