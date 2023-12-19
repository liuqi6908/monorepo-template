import type { IDataDirectory } from '../../../entities/data-directory.interface'

/**
 * 更新数据大类
 * 请求参数
 */
export interface IUpdateRootBodyDto extends
  Pick<IDataDirectory, | 'nameZH' | 'nameEN' | 'order'> {}
