import type { IFilenameDto } from '../../dto/filename.interface'
import type { IUserIdDto } from '../../dto/id/user.interface'

/**
 * 获取认证附件参数
 */
export interface IGetVerifyAttachmentParamDto extends IUserIdDto, IFilenameDto {}
