import { IBasicResponse } from '../basic.interface'
import { IDataDirectory } from '../../entities/data-directory.interface'

/**
 * 获取数据目录
 * 响应数据
 */
export interface IGetDataListResponse extends IBasicResponse<IDataDirectory[]> {}