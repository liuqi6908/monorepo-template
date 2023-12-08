import { IPasswordDto } from '../../dto/password.interface'

/**
 * 根据旧密码修改密码
 * 请求参数
 */
export interface IUpdatePasswordByOldBodyDto {
  oldPassword: IPasswordDto['password']
  newPassword: IPasswordDto['password']
}