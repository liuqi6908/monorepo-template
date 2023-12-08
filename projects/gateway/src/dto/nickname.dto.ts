import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import type { INicknameDto, INicknameOptionalDto } from 'zjf-types'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

function Decorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: '用户昵称',
        example: '法外狂徒张三',
        type: () => String,
      }),
      IsString(),
    ],
    optional,
  )
}

export class NicknameDto implements INicknameDto {
  @Decorator(false)
  nickname: string
}

export class NicknameOptionalDto implements INicknameOptionalDto {
  @Decorator(true)
  nickname?: string
}
