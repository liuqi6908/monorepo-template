import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { decorate } from 'ts-mixer'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import type { Desktop } from 'src/entities/desktop'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({ description: '云桌面 ID' }),
    IsString(),
  ], optional)
}

export class DesktopIdDto {
  @decorate(Decorator())
  desktopId: Desktop['id']
}

export class DesktopIdOptionalDto {
  @decorate(Decorator(true))
  desktopId?: DesktopIdDto['desktopId']
}
