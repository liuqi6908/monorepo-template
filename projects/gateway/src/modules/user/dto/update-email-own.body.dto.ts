import { Mixin } from 'ts-mixer'
import type { IUpdateEmailOwnBodyDto } from 'zjf-types'
import { EmailDto } from 'src/dto/email.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class UpdateEmailOwnBodyDto
  extends Mixin(EmailDto, CodeVerifyDto)
  implements IUpdateEmailOwnBodyDto {}
