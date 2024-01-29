import type { IUser } from '../../entities/user.interface'
import type { IVerificationHistory } from '../../entities/verification.interface'
import type { IAccountDto } from '../../dto/account.interface'
import type { IEmailDto } from '../../dto/email.interface'
import type { IPhoneOptionalDto } from '../../dto/phone.interface'
import type { IPasswordOptionalDto } from '../../dto/password.interface'
import type { INicknameOptionalDto } from '../../dto/nickname.interface'
import type { IVerifyStatusOptionalDto } from '../../dto/verify-status.interface'

/**
 * 创建用户
 * 请求参数
 */
export interface ICreateUserBodyDto extends
  IAccountDto,
  IEmailDto,
  IPhoneOptionalDto,
  IPasswordOptionalDto,
  INicknameOptionalDto,
  IVerifyStatusOptionalDto,
  Partial<Pick<
    IVerificationHistory,
    'school' | 'college' | 'idCard' | 'number' | 'name' | 'dataRole' | 'attachments' | 'rejectReason'
  >> {
  /** 账号是否被删除 */
  isDeleted?: boolean
}

/**
 * 创建用户
 * 响应数据
 */
export interface ICreateUserResDto extends IUser {}
