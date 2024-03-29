interface Env {
  /** ---------------- 仅开发模式 ---------------- */
  /** 客户端启动端口 */
  VITE_CLIENT_PORT?: number
  /** 客户端基础路径 */
  VITE_CLIENT_BASE?: string
  /** 客户端APP名称 */
  VITE_CLIENT_APP_NAME?: string
  /** 客户端APP图标路径 */
  VITE_CLIENT_APP_ICON?: string

  /** 代理目标 */
  VITE_PROXY_TARGET?: string
  /** API基础路径 */
  VITE_API_BASE?: string
}

interface ImportMeta {
  env: Env & ImportMetaEnv
}

declare module '*?raw' {
  const src: string
  export default src
}