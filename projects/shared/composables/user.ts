import { computed, getCurrentInstance, ref } from 'vue'
import { isClient, useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { VerificationStatus } from 'zjf-types'
import { Notify } from 'quasar'
import type {
  ILoginByEmailCodeBodyDto,
  ILoginByPasswordBodyDto,
  ILoginByPhoneCodeBodyDto,
  ILoginSuccessResData,
  IRegisterBodyDto,
  IUpdatePasswordByEmailCodeBodyDto,
  IUpdatePasswordByPhoneCodeBodyDto,
  IUser,
  IVerificationHistory,
  PermissionType,
} from 'zjf-types'
import type { Router } from 'vue-router'

import { rsaEncrypt } from '../utils/rsa'
import { getEnvVariable } from '../utils/env'
import {
  loginByEmailCodeApi,
  loginByPasswordApi,
  loginByPhoneCodeApi,
  logoutApi,
  registerApi,
} from '../api/auth'
import { isDesktopApi } from '../api/desktop'
import {
  getOwnProfileApi,
  updateOwnPasswordByEmailCodeApi,
  updateOwnPasswordByPhoneCodeApi,
} from '../api/user'
import { getLatestVerificationApi } from '../api/verification'
import { AUTH_TOKEN_KEY, LEADING_PAGE_KEY, REMEMBER_LOGIN_INFO_KEY } from '../constants/storage'
import { useSysConfig } from './app'

/** 用户token */
export const authToken = useStorage(AUTH_TOKEN_KEY, '')
/** 用户信息 */
const userInfo = ref<IUser>()
/** 用户信息获取时间 */
const getTime = ref<number>()
/** 用户管理权限 */
const adminRole = ref<PermissionType[]>()
/** 认证信息 */
const latestVerify = ref<IVerificationHistory>()

/** 是否在云桌面中 */
const isDesktop = ref(false)
/** 加载中 */
const loading = ref(false)

export function useUser($router?: Router) {
  const { isAdmin } = useSysConfig()

  const instance = getCurrentInstance()
  if (!$router && instance)
    $router = useRouter()

  /**
   * 判断用户是否在云桌面中
   */
  async function userIsDesktop() {
    isDesktop.value = await isDesktopApi()
  }

  /**
   * 通过 账号/邮箱/手机号码 + 密码 登录
   */
  async function loginByPassword(body: ILoginByPasswordBodyDto, remember = false) {
    loading.value = true
    try {
      const res = await loginByPasswordApi({
        ...body,
        password: rsaEncrypt(body.password),
      })
      if (res && isClient) {
        if (remember) {
          localStorage.setItem(
            REMEMBER_LOGIN_INFO_KEY,
            JSON.stringify({
              userCode: body.account || body.email || body.phone,
              password: rsaEncrypt(body.password),
            }),
          )
        }
        else {
          localStorage.removeItem(REMEMBER_LOGIN_INFO_KEY)
        }
        processLoginInfo(res)
      }
    }
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
    finally {
      loading.value = false
    }
  }

  /**
   * 通过 手机号码 + 验证码 登录
   */
  async function loginByPhoneCode(body: ILoginByPhoneCodeBodyDto) {
    loading.value = true
    try {
      const res = await loginByPhoneCodeApi(body)
      if (res)
        processLoginInfo(res)
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 根据邮箱验证码修改密码
   */
  async function updatePasswordByEmailCode(body: IUpdatePasswordByEmailCodeBodyDto) {
    loading.value = true
    try {
      const res = await updateOwnPasswordByEmailCodeApi(body)
      if (res) {
        Notify.create({
          type: 'success',
          message: '修改密码成功',
        })
        $router?.push('/auth/login')
      }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 根据手机验证码修改密码
   */
  async function updatePasswordByPhoneCode(body: IUpdatePasswordByPhoneCodeBodyDto) {
    loading.value = true
    try {
      const res = await updateOwnPasswordByPhoneCodeApi(body)
      if (res) {
        Notify.create({
          type: 'success',
          message: '修改密码成功',
        })
        $router?.push('/auth/login')
      }
    }
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
        password: rsaEncrypt(body.password),
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
  async function processLoginInfo(res: ILoginSuccessResData) {
    const { sign, user } = res
    authToken.value = sign.access_token
    userInfo.value = user
    await getOwnProfile(undefined, false)
    $router?.push(localStorage?.getItem(LEADING_PAGE_KEY) ?? '/')
  }

  /**
   * 登出
   */
  async function logout(flag = false) {
    if (!flag) {
      await logoutApi()
      if (isAdmin.value)
        $router?.push('/auth/login')
      else
        $router?.push('/')
    }

    authToken.value = ''
    adminRole.value = []
    userInfo.value = undefined
    latestVerify.value = undefined
  }

  /**
   * 获取当前登入用户信息
   */
  async function getOwnProfile(relation = 'role.permissions,verification', useCache = true) {
    if (useCache && userInfo.value && getTime.value && Date.now() - getTime.value < 10 * 1000)
      return

    getTime.value = Date.now()
    const res = await getOwnProfileApi({ relation })
    if (res) {
      userInfo.value = res
      adminRole.value = res.role?.permissions?.map(v => v.name)
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
   * 用户认证状态
   */
  const verifyStatus = computed(() => latestVerify.value?.status)

  /**
   * 用户是否通过认证
   */
  const isVerify = computed(() => isLogin.value && userInfo.value?.verification?.status === VerificationStatus.APPROVED)

  /**
   * 用户是否使用手机号
   */
  const isPhone = computed(() => getEnvVariable('VITE_USER_PHONE', false))

  return {
    adminRole,
    authToken,
    userInfo,
    isLogin,
    isVerify,
    isDesktop,
    isPhone,
    loading,
    latestVerify,
    verifyStatus,
    userIsDesktop,
    loginByPassword,
    loginByEmailCode,
    loginByPhoneCode,
    updatePasswordByEmailCode,
    updatePasswordByPhoneCode,
    register,
    logout,
    getOwnProfile,
    getVerify,
  }
}
