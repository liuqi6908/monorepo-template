import { Mixin } from 'ts-mixer'
import type { IUnbindPhoneOwnBodyDto } from 'zjf-types'
import { PhoneDto } from 'src/dto/phone.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class UnbindPhoneOwnBodyDto
  extends Mixin(PhoneDto, CodeVerifyDto)
  implements IUnbindPhoneOwnBodyDto {}
