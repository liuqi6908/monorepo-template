import { ApiProperty } from '@nestjs/swagger'
import type { ISendPhoneCodeResData, ISendPhoneCodeResDto } from 'zjf-types'
import { SuccessDto } from 'src/dto/success.dto'

export class SendPhoneCodeResData implements ISendPhoneCodeResData {
  @ApiProperty({
    description: '发送到手机的验证码的唯一标识',
  })
  bizId: string
}

export class SendPhoneCodeResDto extends SuccessDto implements ISendPhoneCodeResDto {
  @ApiProperty({ type: () => SendPhoneCodeResData })
  data: SendPhoneCodeResData
}
