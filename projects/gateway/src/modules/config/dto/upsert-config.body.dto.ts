import { IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  DESKTOP_REQUEST_DURATION_OPTION,
  EXPORT_DFT_LG_SIZE_LIMIT,
  EXPORT_DFT_SM_DAILY_LIMIT,
  EXPORT_DFT_SM_SIZE_LIMIT,
  UPLOAD_WORK_DFT_ACCEPT_LIMIT,
  UPLOAD_WORK_DFT_SIZE_LIMIT,
} from 'zjf-types'
import type {
  IDesktopRequestConfigDto,
  IExportConfigDto,
  IUploadWorkConfigDto,
  IUpsertConfigBodyDto,
} from 'zjf-types'

export class UpsertConfigBodyDto implements IUpsertConfigBodyDto {
  @ApiProperty({ description: '配置版本', example: 'export' })
  @IsString()
  version: string

  @ApiPropertyOptional({
    description: '外发配置',
    example: {
      sizeLimitSm: EXPORT_DFT_SM_SIZE_LIMIT,
      sizeLimitLg: EXPORT_DFT_LG_SIZE_LIMIT,
      dailyLimit: EXPORT_DFT_SM_DAILY_LIMIT,
    },
  })
  export?: IExportConfigDto['export']

  @ApiPropertyOptional({
    description: '上传作品配置',
    example: {
      sizeLimit: UPLOAD_WORK_DFT_SIZE_LIMIT,
      acceptLimit: UPLOAD_WORK_DFT_ACCEPT_LIMIT,
    },
  })
  work?: IUploadWorkConfigDto['work']

  @ApiPropertyOptional({
    description: '云桌面申请配置',
    example: {
      duration: DESKTOP_REQUEST_DURATION_OPTION,
    },
  })
  desktop?: IDesktopRequestConfigDto['desktop']
}
