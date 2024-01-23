import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import {
  APP_ICON,
  APP_NAME,
  APP_NAME_EN,
  DESKTOP_FTP_QUOTA,
  DESKTOP_MAX_COUNT,
  DESKTOP_REQUEST_DURATION_OPTION,
  DESKTOP_REQUEST_UPLOAD_DFT_ACCEPT_LIMIT,
  DESKTOP_REQUEST_UPLOAD_DFT_AMOUNT_LIMIT,
  DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT,
  DESKTOP_REQUEST_UPLOAD_HINT,
  EXPORT_DFT_LG_SIZE_LIMIT,
  EXPORT_DFT_SM_DAILY_LIMIT,
  EXPORT_DFT_SM_SIZE_LIMIT,
  NAV_DATABASE_DESC,
  NAV_DATABASE_LABEL,
  NAV_HOME_DESC,
  NAV_HOME_LABEL,
  NAV_QUESTION_DESC,
  NAV_QUESTION_LABEL,
  NAV_REQUEST_DESC,
  NAV_REQUEST_LABEL,
  SysConfig,
  UPLOAD_WORK_DFT_ACCEPT_LIMIT,
  UPLOAD_WORK_DFT_AMOUNT_LIMIT,
  UPLOAD_WORK_DFT_SIZE_LIMIT,
  UPLOAD_WORK_HINT,
  VERIFICATION_UPLOAD_DFT_ACCEPT_LIMIT,
  VERIFICATION_UPLOAD_DFT_AMOUNT_LIMIT,
  VERIFICATION_UPLOAD_DFT_SIZE_LIMIT,
  VERIFICATION_UPLOAD_HINT,
} from 'zjf-types'
import type { IConfigDto } from 'zjf-types'
import { getConfigApi } from '../api/config'
import { APP_MIN_WIDTH } from '../constants/app'

const { width } = useWindowSize()

/** App配置 */
const app = ref<IConfigDto[SysConfig.APP]>()
/** 云桌面申请配置 */
const desktopRequest = ref<IConfigDto[SysConfig.DESKTOP_REQUEST]>()
/** 云桌面配置 */
const desktop = ref<IConfigDto[SysConfig.DESKTOP]>()
/** 云桌面文件传输配置 */
const desktopFtp = ref<IConfigDto[SysConfig.DESKTOP_FTP]>()
/** 外发配置 */
const fileExport = ref<IConfigDto[SysConfig.EXPORT]>()
/** 首页导航栏配置 */
const nav = ref<IConfigDto[SysConfig.NAV]>()
/** 身份认证上传配置 */
const verification = ref<IConfigDto[SysConfig.VERIFICATION]>()
/** 上传作品配置 */
const works = ref<IConfigDto[SysConfig.WORK]>()

/** 是否在管理后台 */
const isAdmin = ref(false)

export function useSysConfig() {
  /**
   * 获取App配置
   */
  async function getAppConfig(useCache = true) {
    if (useCache && app.value)
      return
    const { name = APP_NAME, icon = APP_ICON, nameEn = APP_NAME_EN } = await getConfigApi(SysConfig.APP) || {}
    app.value = {
      name,
      icon,
      nameEn,
    }
  }

  /**
   * 获取云桌面申请配置
   */
  async function getDesktopRequestConfig(useCache = true) {
    if (useCache && desktopRequest.value)
      return
    const {
      duration = DESKTOP_REQUEST_DURATION_OPTION,
      sizeLimit = DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT,
      amountLimit = DESKTOP_REQUEST_UPLOAD_DFT_AMOUNT_LIMIT,
      acceptLimit = DESKTOP_REQUEST_UPLOAD_DFT_ACCEPT_LIMIT,
      hint = DESKTOP_REQUEST_UPLOAD_HINT,
    } = await getConfigApi(SysConfig.DESKTOP_REQUEST) || {}
    desktopRequest.value = {
      duration,
      sizeLimit,
      amountLimit,
      acceptLimit,
      hint,
    }
  }

  /**
   * 获取云桌面配置
   */
  async function getDesktopConfig(useCache = true) {
    if (useCache && desktop.value)
      return
    const {
      max = DESKTOP_MAX_COUNT,
    } = await getConfigApi(SysConfig.DESKTOP) || {}
    desktop.value = {
      max,
    }
  }

  /**
   * 获取云桌面文件传输配置
   */
  async function getDesktopFtpConfig(useCache = true) {
    if (useCache && desktopFtp.value)
      return
    const {
      ftpQuota = DESKTOP_FTP_QUOTA,
    } = await getConfigApi(SysConfig.DESKTOP_FTP) || {}
    desktopFtp.value = {
      ftpQuota,
    }
  }

  /**
   * 获取外发配置
   */
  async function getFileExportConfig(useCache = true) {
    if (useCache && fileExport.value)
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
   * 获取首页导航栏
   */
  async function getNavConfig(useCache = true) {
    if (useCache && nav.value)
      return
    const {
      homeLabel = NAV_HOME_LABEL,
      homeDesc = NAV_HOME_DESC,
      databaseLabel = NAV_DATABASE_LABEL,
      databaseDesc = NAV_DATABASE_DESC,
      questionLabel = NAV_QUESTION_LABEL,
      questionDesc = NAV_QUESTION_DESC,
      requestLabel = NAV_REQUEST_LABEL,
      requestDesc = NAV_REQUEST_DESC,
    } = await getConfigApi(SysConfig.NAV) || {}
    nav.value = {
      homeLabel,
      homeDesc,
      databaseLabel,
      databaseDesc,
      questionLabel,
      questionDesc,
      requestLabel,
      requestDesc,
    }
  }

  /**
   * 获取身份认证上传配置
   */
  async function getVerificationConfig(useCache = true) {
    if (useCache && verification.value)
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
  async function getWorkConfig(useCache = true) {
    if (useCache && works.value)
      return
    const {
      sizeLimit = UPLOAD_WORK_DFT_SIZE_LIMIT,
      acceptLimit = UPLOAD_WORK_DFT_ACCEPT_LIMIT,
      hint = UPLOAD_WORK_HINT,
      amount = UPLOAD_WORK_DFT_AMOUNT_LIMIT,
    } = await getConfigApi(SysConfig.WORK) || {}
    works.value = {
      sizeLimit,
      acceptLimit,
      hint,
      amount,
    }
  }

  /**
   * 窗口缩放比例
   */
  const zoomRatio = computed(() => width.value >= APP_MIN_WIDTH ? 1 : width.value / APP_MIN_WIDTH)

  return {
    app,
    desktopRequest,
    desktop,
    desktopFtp,
    fileExport,
    nav,
    verification,
    works,
    getAppConfig,
    getDesktopRequestConfig,
    getDesktopConfig,
    getDesktopFtpConfig,
    getFileExportConfig,
    getNavConfig,
    getVerificationConfig,
    getWorkConfig,
    isAdmin,
    zoomRatio,
  }
}
