import type { IUserIdDto } from '../../dto/id/user.interface'
import type { IDataRoleIdOptionalDto } from '../../dto/id/data-role.interface'

/**
 * 批量更新用户数据角色
 * 请求参数
 */
export interface IBatchUpdateUserDataRoleBodyDto {
  dataRoleId?: IDataRoleIdOptionalDto['dataRoleId'] | null
  id: IUserIdDto['userId'][]
}
