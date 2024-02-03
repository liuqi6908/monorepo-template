import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { DESKTOP_FTP_QUOTA } from 'zjf-types'
import type { IBatchUpdateDesktopFtpQuotaBodyDto, IDesktop } from 'zjf-types'

export class BatchUpdateDesktopFtpQuotaBodyDto implements IBatchUpdateDesktopFtpQuotaBodyDto {
  @ApiProperty({
    description: 'id',
    type: [String],
  })
  @IsString({ each: true })
  id: IDesktop['id'][]

  @ApiProperty({
    description: '云桌面文件传输配置',
    example: DESKTOP_FTP_QUOTA,
  })
  @IsNumber()
  ftpQuota: number
}
