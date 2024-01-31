import { ApiProperty } from '@nestjs/swagger'
import type { IBatchRejectVerificationBodyDto, IRejectVerificationBodyDto } from 'zjf-types'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { VERIFICATION_REJECT_REASON_MAX, VERIFICATION_REJECT_REASON_MIN } from 'zjf-types'
import type { VerificationIdDto } from 'src/dto/id/verification.dto'

class Reason {
  @ApiProperty({
    description: '驳回的原因',
    minLength: VERIFICATION_REJECT_REASON_MIN,
    maxLength: VERIFICATION_REJECT_REASON_MAX,
  })
  @IsString()
  @MinLength(VERIFICATION_REJECT_REASON_MIN)
  @MaxLength(VERIFICATION_REJECT_REASON_MAX)
  reason: string
}

export class RejectVerificationBodyDto extends Reason implements IRejectVerificationBodyDto {}

export class BatchRejectVerificationBodyDto extends Reason implements IBatchRejectVerificationBodyDto {
  @ApiProperty({
    description: 'id',
    type: [String],
  })
  @IsString({ each: true })
  id: VerificationIdDto['verificationId'][]
}
