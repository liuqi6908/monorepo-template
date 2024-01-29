import { decorate } from 'ts-mixer'
import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { objectEntries } from '@catsjuice/utils'
import { VerificationStatus, verificationStatusDescriptions } from 'zjf-types'
import type { IVerifyStatusDto, IVerifyStatusOptionalDto } from 'zjf-types'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

function Decorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: `认证状态
        \n${objectEntries(verificationStatusDescriptions).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}
        ${sharedVariableMarkdown('VerificationStatus', 'zjf-types', 'status枚举值')}`,
        enum: VerificationStatus,
        example: VerificationStatus.APPROVED,
      }),
      IsEnum(VerificationStatus, { message: 'status必须是 VerificationStatus 枚举值' }),
    ],
    optional,
  )
}

export class VerifyStatusDto implements IVerifyStatusDto {
  /** 认证状态 */
  @decorate(Decorator())
  status: VerificationStatus
}

export class VerifyStatusOptionalDto implements IVerifyStatusOptionalDto {
  /** 账号 */
  @decorate(Decorator(true))
  status?: VerificationStatus
}
