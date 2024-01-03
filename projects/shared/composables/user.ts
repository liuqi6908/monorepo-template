import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { VerificationStatus } from 'zjf-types'
import { encryptPasswordInHttp } from 'zjf-utils'
import { Notify } from 'quasar'
import type {
  ILoginByEmailCodeBodyDto,
  ILoginByPasswordBodyDto,
  ILoginSuccessResData,
  IRegisterBodyDto,
  IUpdatePasswordByCodeBodyDto,
  IUser,
  IVerificationHistory,
} from 'zjf-types'

import { rolePermissionsToLabel } from '../utils/rolePermissions'
import {
  loginByEmailCodeApi,
  loginByPasswordApi,
  logoutApi,
  registerApi,
} from '../api/auth'
import { isDesktopApi } from '../api/desktop'
import { getOwnProfileApi, updateOwnPasswordByCodeApi } from '../api/user'
import { getLatestVerificationApi } from '../api/verification'
import { ADMIN_ROLE_KEY, AUTH_TOKEN_KEY, REMEMBER_LOGIN_INFO_KEY } from '../constants/storage'
import { useSysConfig } from './app'

const { isAdmin } = useSysConfig()

/** 用户token */
export const authToken = useStorage(AUTH_TOKEN_KEY, '')
/** 用户信息 */
const userInfo = ref<IUser>()
/** 用户信息获取时间 */
const getTime = ref<number>()
/** 用户管理权限 */
const adminRole = useStorage<string[]>(ADMIN_ROLE_KEY, [])
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
  async function loginByPassword(body: ILoginByPasswordBodyDto, remember = false) {
    loading.value = true
    try {
      const res = await loginByPasswordApi({
        ...body,
        password: encryptPasswordInHttp(body.password),
      })
      if (res) {
        if (remember) {
          localStorage.setItem(
            REMEMBER_LOGIN_INFO_KEY,
            JSON.stringify({
              userCode: body.account || body.email,
              password: encryptPasswordInHttp(body.password),
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
    catch (_) {}
    finally {
      loading.value = false
    }
  }

  /**
   * 根据邮箱验证码修改密码
   */
  async function updatePasswordByCode(body: IUpdatePasswordByCodeBodyDto) {
    loading.value = true
    try {
      const res = await updateOwnPasswordByCodeApi(body)
      if (res) {
        Notify.create({
          type: 'success',
          message: '修改密码成功',
        })
        $router.push('/auth/login')
      }
    }
    catch (_) {}
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
        password: encryptPasswordInHttp(body.password),
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
    await getOwnProfile()
    $router.push('/')
  }

  /**
   * 登出
   */
  async function logout(flag = false) {
    if (!flag) {
      await logoutApi()
      if (isAdmin.value)
        $router.push('/auth/login')
      else
        $router.push('/')
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
   * 用户认证状态
   */
  const verifyStatus = computed(() => latestVerify.value?.status)

  /**
   * 用户是否通过认证
   */
  const isVerify = computed(() => isLogin.value && userInfo.value?.verification?.status === VerificationStatus.APPROVED)

  const instance = getCurrentInstance()
  if (instance) {
    onMounted(async () => {
      if (!isFetched) {
        isFetched = true
        isDesktop.value = await isDesktopApi()
      }
    })
  }

  return {
    adminRole,
    authToken,
    userInfo,
    isLogin,
    isVerify,
    isDesktop,
    loading,
    latestVerify,
    verifyStatus,
    loginByPassword,
    loginByEmailCode,
    updatePasswordByCode,
    register,
    logout,
    getOwnProfile,
    getVerify,
  }
}
