import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type {
  IBatchRejectDesktopReqBodyDto,
  IDesktopQueue,
  IRejectDesktopReqBodyDto,
} from 'zjf-types'

class Reason {
  @ApiProperty({ description: '驳回的理由' })
  @IsString()
  reason: string
}

export class RejectDesktopReqBodyDto extends Reason implements IRejectDesktopReqBodyDto {}

export class BatchRejectDesktopReqBodyDto extends Reason implements IBatchRejectDesktopReqBodyDto {
  @ApiProperty({
    description: '用户id',
    type: [String],
  })
  @IsString({ each: true })
  id: IDesktopQueue['userId'][]
}
