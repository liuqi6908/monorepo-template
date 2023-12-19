import type { IBasicResponse } from '../basic.interface'
import type { IDataField } from '../../entities/data-field.interface'

/**
 * 获取数据字段说明
 * 响应数据
 */
export interface IGetDataFieldListResDto extends IBasicResponse<IDataField[]> {}
