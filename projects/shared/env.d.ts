interface ImportMetaEnv {
  /** ---------------- 仅开发模式 ---------------- */
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

  /** ---------------- RSA密钥对 ---------------- */
  /** 登录密码加密公钥 */
  VITE_PUBLIC_KEY?: string
  /** 登录密码解密私钥 */
  VITE_PRIVATE_KEY?: string

  /** ---------------- MINIO ---------------- */
  /** MINIO访问地址 */
  VITE_MINIO_ENDPOINT?: string
  /** MINIO端口 */
  VITE_MINIO_PORT?: number
  /** MINIO AccessKey ID */
  VITE_MINIO_AK?: string
  /** MINIO AccessKey Secret */
  VITE_MINIO_SK?: string
  /** 是否使用SSL */
  VITE_MINIO_USE_SSL?: boolean
  /** DATA桶名 */
  VITE_MINIO_BUCKET_DATA?: string
  /** FTP桶名 */
  VITE_MINIO_BUCKET_FTP?: string

  /** ---------------- 功能划分 ---------------- */
  /** ---------------- 通用 ---------------- */
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
  /** 云桌面开关机调用 */
  VITE_DESKTOP_ON_OFF?: boolean

  /** ---------------- 客户端 ---------------- */
  /** 实验室物理主机负载 */
  VITE_HOST_LOAD?: boolean
  /** 云桌面文件传输 */
  VITE_DESKTOP_FTP?: boolean
  /** 云桌面域控前缀 */
  VITE_DC_PREFIX?: string

  /** ---------------- 管理后台 ---------------- */
  /** 截图水印 */
  VITE_WATERMARK?: boolean
  /** 自动分配云桌面 */
  VITE_DESKTOP_AUTO_ALLOT?: boolean
  /** 手动分配云桌面 */
  VITE_DESKTOP_MANUAL_ALLOT?: boolean
}
