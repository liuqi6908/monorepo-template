import { decorate } from 'ts-mixer'
import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { objectEntries } from '@catsjuice/utils'
import { PhoneCodeAction, phoneCodeActionDescriptions } from 'zjf-types'
import type { IPhoneCodeActionDto } from 'zjf-types'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

export class PhoneCodeActionDto implements IPhoneCodeActionDto {
  @decorate(ApiProperty({
    description: `发送验证码的目的
    \n${objectEntries(phoneCodeActionDescriptions).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}
    ${sharedVariableMarkdown('CodeAction', 'zjf-types', 'action枚举值')}`,
    enum: PhoneCodeAction,
    example: PhoneCodeAction.LOGIN,
  }))
  @decorate(IsEnum(PhoneCodeAction, { message: 'action必须是 PhoneCodeAction 枚举值' }))
  action: PhoneCodeAction
}
