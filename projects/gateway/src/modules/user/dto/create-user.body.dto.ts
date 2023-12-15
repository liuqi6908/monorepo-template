import { Mixin } from 'ts-mixer'
import type { ICreateUserBodyDto } from 'zjf-types'
import { AccountDto } from 'src/dto/account.dto'
import { PasswordOptionalDto } from 'src/dto/password.dto'
import { EmailDto } from 'src/dto/email.dto'
import { NicknameOptionalDto } from 'src/dto/nickname.dto'

export class CreateUserBodyDto
  extends Mixin(
    AccountDto,
    EmailDto,
    PasswordOptionalDto,
    NicknameOptionalDto,
  )
  implements ICreateUserBodyDto {}
