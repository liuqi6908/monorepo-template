import { Mixin } from 'ts-mixer'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { objectEntries } from '@catsjuice/utils'
import { LogDimensionId } from 'zjf-types'
import type { IAggLogBodyDto } from 'zjf-types'

import { DslDto } from 'src/dto/dsl.dto'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

export class AggLogBodyDto extends Mixin(DslDto) implements IAggLogBodyDto {
  @ApiProperty({
    description: `聚合维度
    \n${objectEntries(LogDimensionId).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}
    ${sharedVariableMarkdown('LogDimensionId', 'zjf-types', 'dimension枚举值')}`,
    example: LogDimensionId.D_YEAR,
    enum: LogDimensionId,
  })
  @IsEnum(LogDimensionId, { message: 'dimension必须是 LogDimensionId 枚举值' })
  dimension: LogDimensionId

  @ApiPropertyOptional({ description: '最多取多少条' })
  @IsNumber()
  @IsOptional()
  size?: number
}
