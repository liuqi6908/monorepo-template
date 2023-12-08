import { Mixin } from 'ts-mixer'
import type { ICreateUserBodyDto } from 'zjf-types'
import { AccountDto } from 'src/dto/account.dto'
import { PasswordDto } from 'src/dto/password.dto'
import { EmailOptionalDto } from 'src/dto/email.dto'
import { NicknameOptionalDto } from 'src/dto/nickname.dto'

export class CreateUserBodyDto
  extends Mixin(
    AccountDto,
    PasswordDto,
    EmailOptionalDto,
    NicknameOptionalDto,
  )
  implements ICreateUserBodyDto {}
