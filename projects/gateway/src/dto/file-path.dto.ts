import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'
import type { IFilePathDto } from 'zjf-types'

export class FilePathDto implements IFilePathDto {
  @ApiProperty({
    description: '上传的文件完整路径（需要带上文件名、后缀）',
  })
  @IsString()
  @MinLength(1)
  path: string
}
