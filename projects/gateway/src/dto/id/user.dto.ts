import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

import type { IUserIdDto, IUserIdOptionalDto } from 'zjf-types'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({ description: '用户的唯一标识' }),
    IsString(),
  ], optional)
}

export class UserIdDto implements IUserIdDto {
  @decorate(Decorator(false))
  userId: string
}

export class UserIdOptionalDto implements IUserIdOptionalDto {
  @decorate(Decorator(true))
  userId?: UserIdDto['userId']
}
