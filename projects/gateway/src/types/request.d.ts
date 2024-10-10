interface ExtendRequest extends Request {
  /** 中间件捕获的 IP 地址 */
  ip: string | null
}

declare interface FastifyRequest extends ExtendRequest {
  raw: ExtendRequest
}