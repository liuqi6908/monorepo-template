import { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import { IUser } from './user.interface'
import { IDataDirectory } from './data-directory.interface'

/**
 * 数据采购建议
 */
export interface IDataSuggestion extends ICreatedAt, IUpdatedAt {
  /** 推荐的唯一标识 */
  id: string
  /** 推荐数据目录信息 */
  dataDirectory: IDataDirectory
  /** 推荐采购的信息 */
  dataDirectoryId: string
  /** 推荐的原因 */
  reason?: string
  /** 提出的用户id  */
  userId: string
  /** 提出的用户的信息 */
  user: IUser
}