import { ICms } from '../../entities/cms.interface'
import { IBasicResponse } from '../basic.interface'

/**
 * 创建/更新 内容
 * 请求参数
 */
export interface IUpsertCmsBodyDto<T> extends Pick<ICms<T>, 'json'> {}

/**
 * 获取内容的响应
 */
export interface ICmsResponseDto<T> extends IBasicResponse<ICms<T>> {}