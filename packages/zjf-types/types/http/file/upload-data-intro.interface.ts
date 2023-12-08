import { IFilenameDto } from '../../dto/filename.interface'
import { IDataRootIdDto } from '../../dto/id/data-root.interface'

/**
 * 上传数据简介
 * 请求参数
 */
export interface IUploadDataIntroParamDto extends IFilenameDto, IDataRootIdDto {}