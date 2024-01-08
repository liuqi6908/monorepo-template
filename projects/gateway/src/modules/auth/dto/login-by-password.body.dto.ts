import { Mixin } from 'ts-mixer'
import type { ILoginByPasswordBodyDto } from 'zjf-types'
import { AccountOptionalDto } from 'src/dto/account.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import { EmailOptionalDto } from 'src/dto/email.dto'
import { PasswordDto } from 'src/dto/password.dto'

export class LoginByPasswordBodyDto
  extends Mixin(
    PasswordDto,
    AccountOptionalDto,
    EmailOptionalDto,
    CodeVerifyDto,
  )
  implements ILoginByPasswordBodyDto {}
