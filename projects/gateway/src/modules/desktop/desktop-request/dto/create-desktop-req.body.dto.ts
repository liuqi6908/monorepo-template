import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import type {
  ICreateDesktopRequestBodyDto,
  ICreateUserDesktopRequestBodyDto,
} from 'zjf-types'
import { UserIdDto } from 'src/dto/id/user.dto'

export class CreateDesktopRequestBodyDto implements ICreateDesktopRequestBodyDto {
  @ApiProperty({ description: '申请天数' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: '申请天数必须为整数' })
  duration: number

  @ApiProperty({ description: '申请材料列表' })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  attachments: string[]
}

export class CreateUserDesktopRequestBodyDto
  extends UserIdDto
  implements ICreateUserDesktopRequestBodyDto {
  @ApiProperty({ description: '申请天数' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: '申请天数必须为整数' })
  duration: number
}
