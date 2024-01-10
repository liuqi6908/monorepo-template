import { Mixin } from 'ts-mixer'
import type { ILoginByPhoneCodeBodyDto } from 'zjf-types'
import { PhoneDto } from 'src/dto/phone.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class LoginByPhoneCodeBodyDto
  extends Mixin(PhoneDto, CodeVerifyDto)
  implements ILoginByPhoneCodeBodyDto {}
