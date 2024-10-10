/* eslint-disable no-var */
declare global {
  /** 服务版本号 */
  var version: string
  /** 全局路由前缀 */
  var prefix: string

  namespace NodeJS {
    /** 环境变量 */
    interface ProcessEnv {
      /** ---------- 服务器配置 ---------- */
      /** 服务启动端口（默认值：2148） */
      SERVER_PORT?: string | number
      /** 服务基础路径（默认值：`/`） */
      SERVER_BASE_PATH?: string

      /** ---------- 应用相关配置 ---------- */
      /** 应用名称 */
      APP_NAME: string
      /** 应用部署地址 */
      APP_URL: string

      /** ---------- Swagger Api 文档配置 ---------- */
      /** 是否开启 Api 文档 */
      SWAGGER_ENABLED?: string | boolean
      /** Api 文档标题（默认值：API） */
      SWAGGER_TITLE?: string
      /** Api 文档描述（默认值：API DOCS） */
      SWAGGER_DESC?: string
      /** Api 文档路径（默认值：`/docs`） */
      SWAGGER_PATH?: string

      /** ---------- RSA密钥对 ---------- */
      /** 加密公钥 */
      RSA_PUBLIC_KEY?: string
      /** 解密私钥 */
      RSA_PRIVATE_KEY?: string
    }
  }
}
export {}
