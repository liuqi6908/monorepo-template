import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { objectEntries } from '@catsjuice/utils'
import { IsEnum } from 'class-validator'
import { MinioBucket, minioBucketDescriptions } from 'zjf-types'
import type { IBucketDto } from 'zjf-types'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

export class BucketDto implements IBucketDto {
  @decorate(ApiProperty({
    description: `Minio Bucket 桶名
    \n${objectEntries(minioBucketDescriptions).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}
    ${sharedVariableMarkdown('MinioBucket', 'zjf-types', 'bucket枚举值')}`,
    enum: MinioBucket,
    example: MinioBucket.DATA,
  }))
  @decorate(IsEnum(MinioBucket, { message: 'bucket必须是 MinioBucket 枚举值' }))
  bucket: MinioBucket
}
