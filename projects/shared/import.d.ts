interface ImportMetaEnv {
  /** ---------------- 仅开发模式 ---------------- */
  /** 客户端启动端口 */
  VITE_CLIENT_PORT?: number
  /** 客户端基础路径 */
  VITE_CLIENT_BASE?: string
  /** 客户端APP名称 */
  VITE_CLIENT_APP_NAME?: string
  /** 客户端APP图标路径 */
  VITE_CLIENT_APP_ICON?: string
  /** 管理后台启动端口 */
  VITE_ADMIN_PORT?: number
  /** 管理后台基础路径 */
  VITE_ADMIN_BASE?: string
  /** 管理后台APP名称 */
  VITE_ADMIN_APP_NAME?: string
  /** 管理后台APP图标路径 */
  VITE_ADMIN_APP_ICON?: string

  /** 代理目标 */
  VITE_PROXY_TARGET?: string
  /** API基础路径 */
  VITE_API_BASE?: string
}

interface ImportMeta {
  env: ImportMetaEnv
}

declare module '*?raw' {
  const src: string
  export default src
}