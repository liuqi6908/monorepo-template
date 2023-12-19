import type { IAccountDto } from '../dto/account.interface'
import type { IPasswordOptionalDto } from '../dto/password.interface'
import type { IEmailOptionalDto } from '../dto/email.interface'
import type { INicknameOptionalDto } from '../dto/nickname.interface'
import type { IRole } from './role.interface'
import type { ILogin } from './login.interface'
import type { IDesktop } from './desktop.interface'
import type { IDataRole } from './data-role.interface'
import type { IDesktopQueue } from './desktop-queue.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { IVerificationHistory } from './verification.interface'
import type { IFileExportSmall } from './export/file-export-small.interface'
import type { IFileExportLarge } from './export/file-export-large.interface'
import type { IDesktopQueueHistory } from './desktop-queue-history.interface'
import type { IWork } from './work.interface'

/**
 * 用户
 */
export interface IUser extends
  ICreatedAt,
  IUpdatedAt,
  IPasswordOptionalDto,
  IAccountDto,
  IEmailOptionalDto,
  INicknameOptionalDto {
  /** 用户唯一标识（UUID, v4) */
  id: string
  /** 头像地址 */
  avatar?: string

  /** 账号是否被删除 */
  isDeleted?: boolean
  /** 是否是系统管理员 */
  isSysAdmin: boolean
  /** 用户的数据下载角色信息 */
  dataRole?: IDataRole
  /** 数据下载角色Id（数据下载角色外键） */
  dataRoleId?: IDataRole['id']
  /** 用户的角色信息 */
  role?: IRole
  /** 业务角色Id（业务角色外键） */
  roleId?: IRole['id']

  /** 认证信息，只有审核通过后才存在 */
  verification?: IVerificationHistory
  /** 关联的认证信息 id */
  verificationId?: IVerificationHistory['id']
  /** 创建的认证信息 */
  founderVerifications?: IVerificationHistory[]
  /** 处理的认证信息 */
  handlerVerifications?: IVerificationHistory[]

  /** 当前激活的所有的登录信息 */
  logins?: ILogin[]

  /** 当前使用中的云桌面信息 */
  desktop?: IDesktop
  /** 曾使用过的云桌面列表 */
  desktopHistories?: IDesktop[]
  /** 当前排队中的云桌面 */
  desktopQueue?: IDesktopQueue
  /** 已结束的云桌面申请（历史记录） */
  desktopQueueHistory?: IDesktopQueueHistory[]

  /** 外发的小文件列表 */
  exportsSmall?: IFileExportSmall[]
  /** 外发的大文件列表 */
  exportsLarge?: IFileExportLarge[]
  /** 处理过（通过/驳回）的大文件外发列表 */
  exportsLargeHandled?: IFileExportLarge[]

  /** 上传的作品列表 */
  works?: IWork[]
}
