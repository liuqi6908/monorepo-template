import { computed, ref } from 'vue'
import { isClient } from '@vueuse/core'
import {
  APP_ICON,
  APP_NAME,
  DESKTOP_REQUEST_DURATION_OPTION,
  DESKTOP_REQUEST_UPLOAD_DFT_ACCEPT_LIMIT,
  DESKTOP_REQUEST_UPLOAD_DFT_AMOUNT_LIMIT,
  DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT,
  DESKTOP_REQUEST_UPLOAD_HINT,
  EXPORT_DFT_LG_SIZE_LIMIT,
  EXPORT_DFT_SM_DAILY_LIMIT,
  EXPORT_DFT_SM_SIZE_LIMIT,
  SysConfig,
  UPLOAD_WORK_DFT_ACCEPT_LIMIT,
  UPLOAD_WORK_DFT_SIZE_LIMIT,
  UPLOAD_WORK_HINT,
  VERIFICATION_UPLOAD_DFT_ACCEPT_LIMIT,
  VERIFICATION_UPLOAD_DFT_AMOUNT_LIMIT,
  VERIFICATION_UPLOAD_DFT_SIZE_LIMIT,
  VERIFICATION_UPLOAD_HINT,
} from 'zjf-types'
import type { IConfigDto } from 'zjf-types'
import { getConfigApi } from '../api/config'

/** App配置 */
const app = ref<IConfigDto[SysConfig.APP]>()
/** 云桌面申请配置 */
const desktop = ref<IConfigDto[SysConfig.DESKTOP]>()
/** 外发配置 */
const fileExport = ref<IConfigDto[SysConfig.EXPORT]>()
/** 身份认证上传配置 */
const verification = ref<IConfigDto[SysConfig.VERIFICATION]>()
/** 上传作品配置 */
const works = ref<IConfigDto[SysConfig.WORK]>()

export function useSysConfig() {
  /**
   * 获取App配置
   */
  async function getAppConfig() {
    if (app.value)
      return
    const { name = APP_NAME, icon = APP_ICON } = await getConfigApi(SysConfig.APP) || {}
    app.value = {
      name,
      icon,
    }
  }

  /**
   * 获取云桌面申请配置
   */
  async function getDesktopConfig() {
    if (desktop.value)
      return
    const {
      duration = DESKTOP_REQUEST_DURATION_OPTION,
      sizeLimit = DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT,
      amountLimit = DESKTOP_REQUEST_UPLOAD_DFT_AMOUNT_LIMIT,
      acceptLimit = DESKTOP_REQUEST_UPLOAD_DFT_ACCEPT_LIMIT,
      hint = DESKTOP_REQUEST_UPLOAD_HINT,
    } = await getConfigApi(SysConfig.DESKTOP) || {}
    desktop.value = {
      duration,
      sizeLimit,
      amountLimit,
      acceptLimit,
      hint,
    }
  }

  /**
   * 获取外发配置
   */
  async function getFileExportConfig() {
    if (fileExport.value)
      return
    const {
      sizeLimitSm = EXPORT_DFT_SM_SIZE_LIMIT,
      sizeLimitLg = EXPORT_DFT_LG_SIZE_LIMIT,
      dailyLimit = EXPORT_DFT_SM_DAILY_LIMIT,
    } = await getConfigApi(SysConfig.EXPORT) || {}
    fileExport.value = {
      sizeLimitSm,
      sizeLimitLg,
      dailyLimit,
    }
  }

  /**
   * 获取身份认证上传配置
   */
  async function getVerificationConfig() {
    if (verification.value)
      return
    const {
      sizeLimit = VERIFICATION_UPLOAD_DFT_SIZE_LIMIT,
      amountLimit = VERIFICATION_UPLOAD_DFT_AMOUNT_LIMIT,
      acceptLimit = VERIFICATION_UPLOAD_DFT_ACCEPT_LIMIT,
      hint = VERIFICATION_UPLOAD_HINT,
    } = await getConfigApi(SysConfig.VERIFICATION) || {}
    verification.value = {
      sizeLimit,
      amountLimit,
      acceptLimit,
      hint,
    }
  }

  /**
   * 获取上传作品配置
   */
  async function getWorkConfig() {
    if (works.value)
      return
    const {
      sizeLimit = UPLOAD_WORK_DFT_SIZE_LIMIT,
      acceptLimit = UPLOAD_WORK_DFT_ACCEPT_LIMIT,
      hint = UPLOAD_WORK_HINT,
    } = await getConfigApi(SysConfig.WORK) || {}
    desktop.value = {
      sizeLimit,
      acceptLimit,
      hint,
    }
  }

  /**
   * 是否在管理后台
   */
  const isAdmin = computed(() => isClient && window.location.href.includes('/admin'))

  return {
    app,
    desktop,
    fileExport,
    verification,
    works,
    getAppConfig,
    getDesktopConfig,
    getFileExportConfig,
    getVerificationConfig,
    getWorkConfig,
    isAdmin,
  }
}
