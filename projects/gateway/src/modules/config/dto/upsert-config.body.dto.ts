import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { EXPORT_DFT_LG_SIZE_LIMIT, EXPORT_DFT_SM_DAILY_LIMIT, EXPORT_DFT_SM_SIZE_LIMIT } from 'zjf-types'
import type { IUpsertConfigBodyDto } from 'zjf-types'

export class UpsertConfigBodyDto implements IUpsertConfigBodyDto {
  @ApiProperty({ description: '配置版本', example: 'file' })
  @IsString()
  version: string

  @ApiProperty({ description: '小文件尺寸限制，单位为 字节', example: EXPORT_DFT_SM_SIZE_LIMIT })
  @IsNumber()
  sizeLimitSm: number

  @ApiProperty({ description: '大文件尺寸限制，单位为 字节', example: EXPORT_DFT_LG_SIZE_LIMIT })
  @IsNumber()
  sizeLimitLg: number

  @ApiProperty({ description: '小文件每日外发限制', example: EXPORT_DFT_SM_DAILY_LIMIT })
  @IsNumber()
  dailyLimit: number
}
