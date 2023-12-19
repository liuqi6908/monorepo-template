import type { FileExportLargeStatus } from '../../enum/file-export.enum'
import type { IUser } from '../user.interface'
import type { IFileExportBasic } from './file-export-basic.interface'

/**
 * 大文件外发的信息
 */
export interface IFileExportLarge extends IFileExportBasic {
  /** 处理者 */
  handler: IUser
  /** 处理者的唯一标识 */
  handlerId: string
  /** 处理时间 */
  handleAt: Date
  /** 状态 */
  status: FileExportLargeStatus
  /** 驳回原因 */
  rejectReason?: string
}
