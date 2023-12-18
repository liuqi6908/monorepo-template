import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  APP_ICON,
  APP_NAME,
  DESKTOP_REQUEST_DURATION_OPTION,
  EXPORT_DFT_LG_SIZE_LIMIT,
  EXPORT_DFT_SM_DAILY_LIMIT,
  EXPORT_DFT_SM_SIZE_LIMIT,
  UPLOAD_WORK_DFT_ACCEPT_LIMIT,
  UPLOAD_WORK_DFT_SIZE_LIMIT,
} from 'zjf-types'
import type {
  IConfigDto,
  IUpsertConfigBodyDto,
} from 'zjf-types'
import { VersionDto } from 'src/dto/version.dto'

export class UpsertConfigBodyDto extends VersionDto implements IUpsertConfigBodyDto {
  @ApiPropertyOptional({
    description: 'App配置',
    example: {
      name: APP_NAME,
      icon: APP_ICON,
    },
  })
  app?: IConfigDto['app']

  @ApiPropertyOptional({
    description: '云桌面申请配置',
    example: {
      duration: DESKTOP_REQUEST_DURATION_OPTION,
    },
  })
  desktop?: IConfigDto['desktop']

  @ApiPropertyOptional({
    description: '外发配置',
    example: {
      sizeLimitSm: EXPORT_DFT_SM_SIZE_LIMIT,
      sizeLimitLg: EXPORT_DFT_LG_SIZE_LIMIT,
      dailyLimit: EXPORT_DFT_SM_DAILY_LIMIT,
    },
  })
  export?: IConfigDto['export']

  @ApiPropertyOptional({
    description: '上传作品配置',
    example: {
      sizeLimit: UPLOAD_WORK_DFT_SIZE_LIMIT,
      acceptLimit: UPLOAD_WORK_DFT_ACCEPT_LIMIT,
    },
  })
  work?: IConfigDto['work']
}
