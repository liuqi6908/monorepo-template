import { VerificationStatus } from 'zjf-types'
import type { ILoginByPasswordBodyDto, IRegisterBodyDto, IVerificationHistory } from 'zjf-types'
import { encryptPasswordInHttp } from 'zjf-utils'
import { Notify } from 'quasar'

import { getProfile, getVerify, login, logout, register } from '~/api/auth'
import { is } from '~/api/desktop'

/** 认证信息 */
const latestVerify = ref<IVerificationHistory>()
/** 是否云桌面 */
const isDesktop = ref(false)
let isDesktopFetched = false

export function useUser($router = useRouter()) {
  /**
   * 登录
   */
  const useLogin = async (body: ILoginByPasswordBodyDto) => {
    const res = await login({
      ...body,
      password: encryptPasswordInHttp(body.password),
    })
    if (res) {
      authToken.value = res.sign.access_token
      userInfo.value = res.user
      $router.replace({ path: '/' })
    }
  }

  /**
   * 注册
   */
  const useRegister = async (body: IRegisterBodyDto) => {
    const res = await register({
      ...body,
      password: encryptPasswordInHttp(body.password),
    })
    if (res) {
      Notify.create({
        type: 'success',
        message: '注册成功',
      })
      await useLogin(body)
    }
  }

  /**
   * 登出
   */
  const useLogout = () => {
    logout()
    authToken.value = null
    userInfo.value = undefined
    $router.replace({ path: '/' })
  }

  /**
   * 获取当前登入用户信息
   */
  const useGetProfile = async (relation = 'role.permissions,verification') => {
    const res = await getProfile(relation)
    if (res)
      userInfo.value = res
  }

  /**
   * 获取当前登入用户认证信息
   */
  const useGetVerify = async () => {
    latestVerify.value = await getVerify()
    return latestVerify.value
  }

  /**
   * 用户是否登录
   */
  const isLogin = computed(() => !!authToken.value)

  /**
   * 用户是否通过认证
   */
  const isVerify = computed(() => userInfo.value?.verification?.status === VerificationStatus.APPROVED)

  onMounted(async () => {
    if (!isDesktopFetched) {
      isDesktopFetched = true
      isDesktop.value = await is()
    }
  })

  return {
    userInfo,
    authToken,
    isLogin,
    isVerify,
    latestVerify,
    isDesktop,
    useLogin,
    useRegister,
    useLogout,
    useGetProfile,
    useGetVerify,
  }
}
