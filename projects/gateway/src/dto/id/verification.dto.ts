import { decorate } from 'ts-mixer'
import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { IVerificationIdDto, IVerificationIdOptionalDto } from 'zjf-types'
import type { VerificationHistory } from 'src/entities/verification'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({ description: '身份认证申请记录的唯一标识' }),
    IsUUID('4', { message: '非合法的 id' }),
  ], optional)
}

export class VerificationIdDto implements IVerificationIdDto {
  @decorate(Decorator())
  verificationId: VerificationHistory['id']
}

export class VerificationIdOptionalDto implements IVerificationIdOptionalDto {
  @decorate(Decorator(true))
  verificationId?: VerificationIdDto['verificationId']
}
