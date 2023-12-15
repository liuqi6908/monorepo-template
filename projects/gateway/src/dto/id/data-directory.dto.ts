import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DataDirectoryIdDto {
  @ApiProperty({
    description: '数据目录的唯一标识（目前仅 level4 表格可用）',
  })
  @IsString()
  dataDirectoryId: string
}
