import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  APP_ICON,
  APP_NAME,
  APP_NAME_EN,
  DESKTOP_MAX_COUNT,
  DESKTOP_REQUEST_DURATION_OPTION,
  DESKTOP_REQUEST_UPLOAD_DFT_ACCEPT_LIMIT,
  DESKTOP_REQUEST_UPLOAD_DFT_AMOUNT_LIMIT,
  DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT,
  DESKTOP_REQUEST_UPLOAD_HINT,
  EXPORT_DFT_LG_SIZE_LIMIT,
  EXPORT_DFT_SM_DAILY_LIMIT,
  EXPORT_DFT_SM_SIZE_LIMIT,
  NAV_DATABASE_DESC,
  NAV_DATABASE_LABEL,
  NAV_HOME_DESC,
  NAV_HOME_LABEL,
  NAV_QUESTION_DESC,
  NAV_QUESTION_LABEL,
  NAV_REQUEST_DESC,
  NAV_REQUEST_LABEL,
  UPLOAD_WORK_DFT_ACCEPT_LIMIT,
  UPLOAD_WORK_DFT_AMOUNT_LIMIT,
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
      nameEn: APP_NAME_EN,
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
      max: DESKTOP_MAX_COUNT,
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
    description: '首页导航栏配置',
    example: {
      homeLabel: NAV_HOME_LABEL,
      homeDesc: NAV_HOME_DESC,
      databaseLabel: NAV_DATABASE_LABEL,
      databaseDesc: NAV_DATABASE_DESC,
      questionLabel: NAV_QUESTION_LABEL,
      questionDesc: NAV_QUESTION_DESC,
      requestLabel: NAV_REQUEST_LABEL,
      requestDesc: NAV_REQUEST_DESC,
    },
  })
  nav?: IConfigDto[SysConfig.NAV]

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
      amount: UPLOAD_WORK_DFT_AMOUNT_LIMIT,
    },
  })
  work?: IConfigDto[SysConfig.WORK]
}
