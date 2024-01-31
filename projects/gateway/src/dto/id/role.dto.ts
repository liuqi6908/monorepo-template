import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { Role } from 'src/entities/role'
import type { IRoleIdDto, IRoleIdOptionalDto } from 'zjf-types'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description: '角色的唯一标识',
      type: () => String,
      example: 'root',
    }),
    IsString(),
  ], optional)
}

export class RoleIdDto implements IRoleIdDto {
  @decorate(Decorator())
  roleId: Role['id']
}

export class RoleIdOptionalDto implements IRoleIdOptionalDto {
  @decorate(Decorator(true))
  roleId?: RoleIdDto['roleId']
}
