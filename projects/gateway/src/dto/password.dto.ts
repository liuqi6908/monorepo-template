import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsString, MaxLength, MinLength } from 'class-validator'
import type { IPasswordDto, IPasswordOptionalDto } from 'zjf-types/types/dto/password.interface'
import { rsaDecrypt } from 'src/utils/rsa'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import { IsValidPassword } from 'src/decorators/validators/is-valid-password'

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_DESC,
} from 'zjf-utils'

export function Decorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: `密码，需要加密，${PASSWORD_REQUIREMENTS_DESC}
        ${sharedVariableMarkdown('PASSWORD_REQUIREMENTS_DESC')}
        ${sharedVariableMarkdown('encryptPasswordInHttp', undefined, '加密函数')}`,
        maxLength: PASSWORD_MAX_LENGTH,
        minLength: PASSWORD_MIN_LENGTH,
        type: () => String,
        example: 'empmVXNPMTExMTExMTE=',
      }),
      IsValidPassword(),
      MinLength(PASSWORD_MIN_LENGTH, { message: `密码长度不能小于${PASSWORD_MIN_LENGTH}` }),
      MaxLength(PASSWORD_MAX_LENGTH, { message: `密码长度不能大于${PASSWORD_MAX_LENGTH}` }),
      IsString({ message: '密码必须是字符串' }),
      Transform(({ value }) => rsaDecrypt(value)),
    ],
    optional,
  )
}

export class PasswordDto implements IPasswordDto {
  @decorate(Decorator())
  password: string
}

export class PasswordOptionalDto implements IPasswordOptionalDto {
  @decorate(Decorator(true))
  declare password?: string
}
