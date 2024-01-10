import { Mixin } from 'ts-mixer'
import type { IUpdatePhoneOwnBodyDto } from 'zjf-types'
import { PhoneDto } from 'src/dto/phone.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class UpdatePhoneOwnBodyDto
  extends Mixin(PhoneDto, CodeVerifyDto)
  implements IUpdatePhoneOwnBodyDto {}
