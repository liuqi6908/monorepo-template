import { ApiProperty } from '@nestjs/swagger'
import { IConfigDto } from 'zjf-types'
import { SuccessDto } from 'src/dto/success.dto'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

export class ConfigResDto extends SuccessDto {
  @ApiProperty({
    description: sharedVariableMarkdown('IConfigDto', 'zjf-types', '配置对象类型定义'),
  })
  data: IConfigDto
}
