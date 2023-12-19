import type { IBucketDto } from '../../dto/bucket.interface'
import type { IFilePathDto } from '../../dto/file-path.interface'

/**
 * 文件服务
 * 请求参数
 */
export interface IFileServesBodyDto extends IBucketDto, IFilePathDto {}
