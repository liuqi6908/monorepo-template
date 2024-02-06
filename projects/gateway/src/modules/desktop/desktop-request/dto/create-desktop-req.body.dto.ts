import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import type {
  IBatchCreateUserDesktopRequestBodyDto,
  ICreateDesktopRequestBodyDto,
} from 'zjf-types'
import type { UserIdDto } from 'src/dto/id/user.dto'

class Duration {
  @ApiProperty({ description: '申请天数' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: '申请天数必须为整数' })
  duration: number
}

export class CreateDesktopRequestBodyDto extends Duration implements ICreateDesktopRequestBodyDto {
  @ApiProperty({ description: '申请材料列表' })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  attachments: string[]
}

export class BatchCreateUserDesktopRequestBodyDto
  extends Duration
  implements IBatchCreateUserDesktopRequestBodyDto {
  @ApiProperty({
    description: '用户id',
    type: [String],
  })
  @IsString({ each: true })
  id: UserIdDto['userId'][]
}
