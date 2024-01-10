import { Mixin } from 'ts-mixer'
import type { IUpdatePasswordByPhoneCodeBodyDto } from 'zjf-types'
import { PhoneDto } from 'src/dto/phone.dto'
import { PasswordDto } from 'src/dto/password.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class UpdatePasswordByPhoneCodeBodyDto
  extends Mixin(PasswordDto, PhoneDto, CodeVerifyDto)
  implements IUpdatePasswordByPhoneCodeBodyDto {}
