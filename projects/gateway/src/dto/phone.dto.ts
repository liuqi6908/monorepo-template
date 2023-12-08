import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { MaxLength, MinLength } from 'class-validator'
import type { IPhoneDto, IPhoneOptionalDto } from 'zjf-types'
import { IsValidPhone } from 'src/decorators/validators/is-valid-phone'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

import {
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PHONE_NUMBER_REQUIREMENTS_DESC,
} from 'zjf-utils'

function Decorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: `手机号码, ${PHONE_NUMBER_REQUIREMENTS_DESC}` + `\n${sharedVariableMarkdown('PHONE_NUMBER_REQUIREMENTS_DESC')}`,
        maxLength: PHONE_NUMBER_MAX_LENGTH,
        minLength: PHONE_NUMBER_MIN_LENGTH,
        type: () => String,
        example: '18888888888',
      }),
      IsValidPhone(),
      MinLength(PHONE_NUMBER_MIN_LENGTH, { message: `手机号码长度不能小于${PHONE_NUMBER_MIN_LENGTH}` }),
      MaxLength(PHONE_NUMBER_MAX_LENGTH, { message: `手机号码长度不能大于${PHONE_NUMBER_MAX_LENGTH}` }),
      Transform(({ value }) => value.toString()),
    ],
    optional,
  )
}

export class PhoneDto implements IPhoneDto {
  @decorate(Decorator(false))
  phone: string
}

export class PhoneOptionalDto implements IPhoneOptionalDto {
  @decorate(Decorator(true))
  declare phone?: string
}
