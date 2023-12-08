import { ApiProperty } from '@nestjs/swagger'
import type { ICreateUserResDto } from 'zjf-types'
import { User } from 'src/entities/user'
import { SuccessDto } from 'src/dto/success.dto'

export class CreateUserResDto extends SuccessDto<ICreateUserResDto> {
  @ApiProperty({ description: '创建的用户信息', type: () => User })
  data: User
}
