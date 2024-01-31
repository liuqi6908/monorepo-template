import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { IDataRoleIdDto, IDataRoleIdOptionalDto } from 'zjf-types'
import type { DataRole } from 'src/entities/data-role'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description: '数据角色的唯一标识',
      type: () => String,
      example: 'visitor',
    }),
    IsString(),
  ], optional)
}

export class DataRoleIdDto implements IDataRoleIdDto {
  @decorate(Decorator())
  dataRoleId: DataRole['id']
}

export class DataRoleIdOptionalDto implements IDataRoleIdOptionalDto {
  @decorate(Decorator(true))
  dataRoleId?: DataRoleIdDto['dataRoleId']
}
