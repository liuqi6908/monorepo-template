import { Mixin } from 'ts-mixer'
import type { ICreateUserBodyDto } from 'zjf-types'
import { AccountDto } from 'src/dto/account.dto'
import { EmailOptionalDto } from 'src/dto/email.dto'
import { PhoneOptionalDto } from 'src/dto/phone.dto'
import { PasswordOptionalDto } from 'src/dto/password.dto'
import { NicknameOptionalDto } from 'src/dto/nickname.dto'

export class CreateUserBodyDto
  extends Mixin(
    AccountDto,
    EmailOptionalDto,
    PhoneOptionalDto,
    PasswordOptionalDto,
    NicknameOptionalDto,
  )
  implements ICreateUserBodyDto {}
