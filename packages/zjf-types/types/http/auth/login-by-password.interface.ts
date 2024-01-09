import type { IBasicResponse } from '../basic.interface'
import type { IUser } from '../../entities/user.interface'
import type { IPasswordDto } from '../../dto/password.interface'
import type { IEmailOptionalDto } from '../../dto/email.interface'
import type { IPhoneOptionalDto } from '../../dto/phone.interface'
import type { IAccountOptionalDto } from '../../dto/account.interface'
import type { ICodeVerifyDto } from '../../dto/code-verify.interface'

/**
 * 根据 账号/邮箱/手机号码 + 密码 登录
 * 请求参数
 */
export interface ILoginByPasswordBodyDto
  extends
  IPasswordDto,
  IAccountOptionalDto,
  IEmailOptionalDto,
  IPhoneOptionalDto,
  ICodeVerifyDto {}

/**
 * 登录成功的响应数据
 */
export interface ILoginSuccessResData {
  /** 登录凭证信息 */
  sign: {
    /** JWT 登录凭证 */
    access_token: string
    /** 过期时间戳 */
    expireAt: number
  }
  /** 用户信息 */
  user: IUser
}

/**
 * 登录成功的响应
 */
export interface ILoginSuccessResDto extends IBasicResponse<ILoginSuccessResData> {}
