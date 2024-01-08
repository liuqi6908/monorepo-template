import type {
  ILoginByEmailCodeBodyDto,
  ILoginByEmailLinkDto,
  ILoginByPasswordBodyDto,
  ILoginSuccessResData,
  IRegisterBodyDto,
} from 'zjf-types'
import { useRequest } from '../composables/request'
import { authToken } from '../composables/user'

const { $get, $post, $put } = useRequest()

/**
 * 通过 账号/邮箱 + 密码 登录
 */
export function loginByPasswordApi(body: ILoginByPasswordBodyDto) {
  return $post<ILoginSuccessResData>('/auth/login/password', body)
}

/**
 * 通过 邮箱 + 验证码 登录
 */
export function loginByEmailCodeApi(body: ILoginByEmailCodeBodyDto) {
  return $post<ILoginSuccessResData>('/auth/login/email/code', body)
}

/**
 * 通过 邮箱魔法链接 登录（半分钟内只能发送一次）
 */
export function loginByEmailLinkApi(body: ILoginByEmailLinkDto) {
  return $post('/auth/login/email/link', body)
}

/**
 * 注册（邮箱 + 验证码）
 */
export function registerApi(body: IRegisterBodyDto) {
  return $put<ILoginSuccessResData>('/auth/register', body)
}

/**
 * 获取图形验证码
 */
export function getCaptchaImgApi() {
  return $get<{
    bizId: string
    img: string
  }>('/auth/captcha')
}

/**
 * 登出
 */
export function logoutApi() {
  if (authToken.value)
    return $post<boolean>('/auth/logout')
}
