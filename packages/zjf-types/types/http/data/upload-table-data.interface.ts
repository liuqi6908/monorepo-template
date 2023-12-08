import { IFilenameDto } from '../../dto/filename.interface'
import { IDataRootIdDto } from '../../dto/id/data-root.interface'
import { IUploadTypeDto } from '../../dto/upload-type.interface'

/**
 * 上传表格数据
 * 请求参数
 */
export interface IUploadTableDataParamDto extends IUploadTypeDto, IFilenameDto, IDataRootIdDto {}