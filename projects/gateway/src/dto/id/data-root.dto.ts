import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { IDataRootIdDto, IDataRootIdOptionalDto } from 'zjf-types'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description: '数据大类的唯一标识',
    }),
    IsString(),
  ], optional)
}

export class DataRootIdDto implements IDataRootIdDto {
  @decorate(Decorator())
  dataRootId: string
}

export class DataRootIdOptionalDto implements IDataRootIdOptionalDto {
  @decorate(Decorator(true))
  dataRootId?: DataRootIdDto['dataRootId']
}
