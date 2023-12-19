import type { IFilenameDto } from '../../dto/filename.interface'
import type { IDataRootIdDto } from '../../dto/id/data-root.interface'
import type { IUploadTypeDto } from '../../dto/upload-type.interface'

/**
 * 上传表格数据
 * 请求参数
 */
export interface IUploadTableDataParamDto extends IUploadTypeDto, IFilenameDto, IDataRootIdDto {}
