import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VerificationStatus } from 'zjf-types'
import { encryptPasswordInHttp } from 'zjf-utils'
import { Notify } from 'quasar'
import type {
  ILoginByPasswordBodyDto,
  ILoginByEmailCodeBodyDto,
  ILoginSuccessResData,
  IRegisterBodyDto,
  IVerificationHistory
} from 'zjf-types'

import {
  loginByPasswordApi,
  loginByEmailCodeApi,
  logoutApi,
  getOwnProfileApi,
  getLatestVerificationApi,
  registerApi,
  isDesktopApi
} from '~/api'
import { rolePermissionsToLabel } from '~/utils'
import { adminRole, authToken, useApp, userInfo } from '.'

const { isAdmin } = useApp()

/** 认证信息 */
const latestVerify = ref<IVerificationHistory>()
/** 是否在云桌面中 */
const isDesktop = ref(false)
/** 加载中 */
const loading = ref(false)

let isFetched = false

export function useUser($router = useRouter()) {
  /**
   * 通过 账号/邮箱 + 密码 登录
   */
  async function loginByPassword(body: ILoginByPasswordBodyDto) {
    loading.value = true
    try {
      const res = await loginByPasswordApi({
        ...body,
        password: encryptPasswordInHttp(body.password)
      })
      if (res)
        processLoginInfo(res)
    }
    catch (_) {}
    finally {
      loading.value = false
    }
  }

  /**
   * 通过 邮箱 + 验证码 登录
   */
  async function loginByEmailCode(body: ILoginByEmailCodeBodyDto) {
    loading.value = true
    try {
      const res = await loginByEmailCodeApi(body)
      if (res)
        processLoginInfo(res)
    }
    catch (_) { }
    finally {
      loading.value = false
    }
  }

  /**
   * 注册
   */
  async function register(body: IRegisterBodyDto) {
    loading.value = true
    try {
      const res = await registerApi({
        ...body,
        password: encryptPasswordInHttp(body.password)
      })
      if (res) {
        Notify.create({
          type: 'success',
          message: '注册成功',
        })
        processLoginInfo(res)
      }
    }
    catch (_) {}
    finally {
      loading.value = false
    }
  }

  /**
   * 处理登录信息
   */
  function processLoginInfo(res: ILoginSuccessResData) {
    const { sign, user } = res
    authToken.value = sign.access_token
    userInfo.value = user
    $router.push('/')
  }

  /**
   * 登出
   */
  async function logout() {
    await logoutApi()
    authToken.value = ''
    adminRole.value = []
    userInfo.value = undefined
    if (isAdmin.value)
      $router.push('/auth/login')
    else
      $router.push('/')
  }

  /**
   * 获取当前登入用户信息
   */
  async function getOwnProfile(relation = 'role.permissions,verification') {
    const res = await getOwnProfileApi({ relation })
    if (res) {
      userInfo.value = res
      const permissions = res.role?.permissions?.map(v => v.name)
      adminRole.value = rolePermissionsToLabel(permissions)
    }
    return res
  }

  /**
   * 获取当前登入用户认证信息
   */
  async function getVerify() {
    latestVerify.value = await getLatestVerificationApi()
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
    if (!isFetched) {
      isFetched = true
      isDesktop.value = await isDesktopApi()
    }
  })

  return {
    adminRole,
    authToken,
    userInfo,
    isLogin,
    isVerify,
    isDesktop,
    loading,
    latestVerify,
    loginByPassword,
    loginByEmailCode,
    register,
    logout,
    getOwnProfile,
    getVerify
  }
}
