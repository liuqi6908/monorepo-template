interface ImportMetaEnv {
  /** ----------------仅开发模式 ---------------- */
  /** 客户端启动端口 */
  VITE_PORT_CLIENT?: number
  /** 管理后台启动端口 */
  VITE_PORT_ADMIN?: number
  /** 客户端基础路径 */
  VITE_BASE_CLIENT?: string
  /** 管理后台基础路径 */
  VITE_BASE_ADMIN?: string

  /** 代理目标 */
  VITE_PROXY_TARGET?: string
  /** API基础路径 */
  VITE_API_BASE?: string

  /** 登录密码加密公钥 */
  VITE_PUBLIC_KEY?: string
  /** 登录密码解密私钥 */
  VITE_PRIVATE_KEY?: string

  /** ----------------功能划分 ---------------- */
  /** ----------------通用 ---------------- */
  /** 首页拓展 */
  VITE_HOME_EXPAND?: boolean
  /** 动态数据列表（2-5级） */
  VITE_DYNAMIC_DATA_LIST?: boolean
  /** 数据预购 */
  VITE_DATA_PRE_PURCHASE?: boolean
  /** 作品管理 */
  VITE_WORKS_MANAGE?: boolean
  /** 用户手机号 */
  VITE_USER_PHONE?: boolean

  /** ----------------客户端 ---------------- */
  /** 实验室物理主机负载 */
  VITE_HOST_LOAD?: boolean
  /** 云桌面开关机调用 */
  VITE_DESKTOP_ON_OFF?: boolean
  /** 云桌面文件传输 */
  VITE_DESKTOP_FTP?: boolean

  /** ----------------管理后台 ---------------- */
  /** 自动分配云桌面 */
  VITE_DESKTOP_AUTO_ALLOT?: boolean
  /** 手动分配云桌面 */
  VITE_DESKTOP_MANUAL_ALLOT?: boolean
}