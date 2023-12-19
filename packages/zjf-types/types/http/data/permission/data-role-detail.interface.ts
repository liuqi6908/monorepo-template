import type { IDataRole } from '../../../entities/data-role.interface'
import type { IBasicResponse } from '../../basic.interface'

/**
 * 查询数据下载角色详情
 * 响应数据
 */
export interface IDataRoleDetailResDto extends IBasicResponse<IDataRole> {}
