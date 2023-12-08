import { ApiProperty } from '@nestjs/swagger'
import type { ICmsResponseDto } from 'zjf-types'
import { SuccessDto } from 'src/dto/success.dto'
import { Cms } from 'src/entities/cms'

export class CmsResDto<T>
  extends SuccessDto<Cms<T>>
  implements ICmsResponseDto<T> {
  @ApiProperty({ type: () => Cms })
  data: Cms<T>
}
