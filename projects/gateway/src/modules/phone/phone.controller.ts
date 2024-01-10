import { Throttle } from '@nestjs/throttler'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { PhoneCodeSendable } from 'src/guards/phone-code-sendable.guard'

import { PhoneService } from './phone.service'
import { SendPhoneCodeResDto } from './dto/send-phone-code.res.dto'
import { SendPhoneCodeBodyDto } from './dto/send-phone-code.body.dto'

@ApiTags('Phone | 手机服务')
@Controller('phone')
export class PhoneController {
  constructor(
    private readonly _phoneSrv: PhoneService,
  ) {}

  @Throttle(1, 10)
  @ApiOperation({ summary: '发送验证码' })
  @ApiSuccessResponse(SendPhoneCodeResDto)
  @PhoneCodeSendable()
  @Post('code')
  public async sendCode(@Body() body: SendPhoneCodeBodyDto) {
    return await this._phoneSrv.sendCode(body)
  }
}
