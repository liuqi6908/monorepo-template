import { IDataRole } from '../../../entities/data-role.interface'
import { IBasicResponse } from '../../basic.interface'

/**
 * 查询数据下载角色详情
 * 响应数据
 */
export interface IDataRoleDetailResDto extends IBasicResponse<IDataRole> {}