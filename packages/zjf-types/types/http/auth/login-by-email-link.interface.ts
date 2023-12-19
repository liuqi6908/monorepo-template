import type { IEmailDto } from '../../dto/email.interface'

/**
 * 根据邮箱链接登录
 */
export interface ILoginByEmailLinkDto extends IEmailDto {
  /** 重定向的地址 */
  redirect: string

  /**
   * token 存储的参数名称
   * @default 'token'
   */
  queryName?: string
}
