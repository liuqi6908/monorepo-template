import { IUser } from '../../entities/user.interface'

/**
 * 修改基本信息
 * 请求参数
 */
export interface IUpdateProfileOwnBodyDto extends Pick<IUser, 'nickname'> {}