import { Mixin } from 'ts-mixer'
import type { ISendEmailCodeBodyDto } from 'zjf-types'
import { EmailDto } from 'src/dto/email.dto'
import { CodeActionDto } from 'src/dto/code-action.dto'

export class SendEmailCodeBodyDto
  extends Mixin(EmailDto, CodeActionDto)
  implements ISendEmailCodeBodyDto {}
