import { IDataDirectory } from '../../../entities/data-directory.interface'

/**
 * 创建数据大类
 * 请求参数
 */
export interface ICreateRootBodyDto extends
  Pick<IDataDirectory, 'id' | 'nameZH' | 'nameEN' | 'order'> {}