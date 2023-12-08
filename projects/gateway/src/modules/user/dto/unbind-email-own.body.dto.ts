import { Mixin } from 'ts-mixer'
import type { IUnbindEmailOwnBodyDto } from 'zjf-types'
import { EmailDto } from 'src/dto/email.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class UnbindEmailOwnBodyDto
  extends Mixin(EmailDto, CodeVerifyDto)
  implements IUnbindEmailOwnBodyDto {}
