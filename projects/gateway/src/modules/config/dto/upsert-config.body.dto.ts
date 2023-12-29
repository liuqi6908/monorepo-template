import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  APP_ICON,
  APP_NAME,
  DESKTOP_REQUEST_DURATION_OPTION,
  DESKTOP_REQUEST_UPLOAD_DFT_ACCEPT_LIMIT,
  DESKTOP_REQUEST_UPLOAD_DFT_AMOUNT_LIMIT,
  DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT,
  DESKTOP_REQUEST_UPLOAD_HINT,
  EXPORT_DFT_LG_SIZE_LIMIT,
  EXPORT_DFT_SM_DAILY_LIMIT,
  EXPORT_DFT_SM_SIZE_LIMIT,
  UPLOAD_WORK_DFT_ACCEPT_LIMIT,
  UPLOAD_WORK_DFT_SIZE_LIMIT,
  UPLOAD_WORK_HINT,
  VERIFICATION_UPLOAD_DFT_ACCEPT_LIMIT,
  VERIFICATION_UPLOAD_DFT_AMOUNT_LIMIT,
  VERIFICATION_UPLOAD_DFT_SIZE_LIMIT,
  VERIFICATION_UPLOAD_HINT,
} from 'zjf-types'
import type {
  IConfigDto,
  IUpsertConfigBodyDto,
  SysConfig,
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
  app?: IConfigDto[SysConfig.APP]

  @ApiPropertyOptional({
    description: '云桌面申请配置',
    example: {
      duration: DESKTOP_REQUEST_DURATION_OPTION,
      sizeLimit: DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT,
      amountLimit: DESKTOP_REQUEST_UPLOAD_DFT_AMOUNT_LIMIT,
      acceptLimit: DESKTOP_REQUEST_UPLOAD_DFT_ACCEPT_LIMIT,
      hint: DESKTOP_REQUEST_UPLOAD_HINT,
    },
  })
  desktop?: IConfigDto[SysConfig.DESKTOP]

  @ApiPropertyOptional({
    description: '外发配置',
    example: {
      sizeLimitSm: EXPORT_DFT_SM_SIZE_LIMIT,
      sizeLimitLg: EXPORT_DFT_LG_SIZE_LIMIT,
      dailyLimit: EXPORT_DFT_SM_DAILY_LIMIT,
    },
  })
  export?: IConfigDto[SysConfig.EXPORT]

  @ApiPropertyOptional({
    description: '身份认证上传配置',
    example: {
      sizeLimit: VERIFICATION_UPLOAD_DFT_SIZE_LIMIT,
      amountLimit: VERIFICATION_UPLOAD_DFT_AMOUNT_LIMIT,
      acceptLimit: VERIFICATION_UPLOAD_DFT_ACCEPT_LIMIT,
      hint: VERIFICATION_UPLOAD_HINT,
    },
  })
  verification?: IConfigDto[SysConfig.VERIFICATION]

  @ApiPropertyOptional({
    description: '上传作品配置',
    example: {
      sizeLimit: UPLOAD_WORK_DFT_SIZE_LIMIT,
      acceptLimit: UPLOAD_WORK_DFT_ACCEPT_LIMIT,
      hint: UPLOAD_WORK_HINT,
    },
  })
  work?: IConfigDto[SysConfig.WORK]
}
