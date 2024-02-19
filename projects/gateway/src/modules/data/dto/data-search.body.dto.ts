import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, MaxLength } from 'class-validator'
import type { IDataSearchBodyDto } from 'zjf-types'

export class DataSearchBodyDto implements IDataSearchBodyDto {
  @ApiProperty({
    description: '搜索层级（1-5，分别对应 数据库、子库、模块、表格、字段）',
    example: 4,
  })
  @IsNumber()
  level: number

  @ApiProperty({
    description: '搜索关键词',
    example: '数量统计',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50, { message: '搜索关键词最大长度为50个字符' })
  value: string
}
