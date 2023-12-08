import { ApiProperty } from '@nestjs/swagger'
import type { IUserProfileResDto } from 'zjf-types'
import { SuccessDto } from 'src/dto/success.dto'
import { User } from 'src/entities/user'

export class UserProfileResponseDto
  extends SuccessDto<User>
  implements IUserProfileResDto {
  @ApiProperty({ type: () => User })
  data: User
}
