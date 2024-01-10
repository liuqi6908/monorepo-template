import { Mixin } from 'ts-mixer'
import type { ISendPhoneCodeBodyDto } from 'zjf-types'
import { PhoneDto } from 'src/dto/phone.dto'
import { PhoneCodeActionDto } from 'src/dto/phone-code-action.dto'

export class SendPhoneCodeBodyDto
  extends Mixin(PhoneDto, PhoneCodeActionDto)
  implements ISendPhoneCodeBodyDto {}
