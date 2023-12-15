import { IExportConfigDto, IUploadWorkConfigDto, IDesktopRequestConfigDto } from '../../dto/config.interface'

/**
 * 创建/更新 全局配置
 * 请求参数
 */
export interface IUpsertConfigBodyDto
  extends
  IExportConfigDto,
  IUploadWorkConfigDto,
  IDesktopRequestConfigDto {
  /** 配置版本 */
  version: string
}
