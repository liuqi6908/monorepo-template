import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'
import type { IFilePathDto } from 'zjf-types'

export class FilePathDto implements IFilePathDto {
  @decorate(ApiProperty({
    description: '上传的文件完整路径（需要带上文件名、后缀）',
    example: 'path',
    type: () => 'string',
  }))
  @decorate(IsString())
  @decorate(MinLength(1))
  path: string
}
