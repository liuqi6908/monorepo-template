import { ApiPropertyOptional } from '@nestjs/swagger'
import { DESKTOP_FTP_QUOTA } from 'zjf-types'
import type { IUpdateDesktopFtpQuotaBodyDto } from 'zjf-types'

export class UpdateDesktopFtpQuotaBodyDto implements IUpdateDesktopFtpQuotaBodyDto {
  @ApiPropertyOptional({
    description: '云桌面文件传输配置',
    example: DESKTOP_FTP_QUOTA,
  })
  ftpQuota: number
}
