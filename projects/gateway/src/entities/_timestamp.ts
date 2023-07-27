import { Mixin, decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class CreatedAt {
  @decorate(
    ApiProperty({
      description: '记录插入时间',
      type: 'string',
      example: '2022-01-12T06:47:16.056Z',
    }),
  )
  @decorate(CreateDateColumn({ name: 'createdAt', type: 'timestamp' }))
  createdAt: Date
}

export class UpdatedAt {
  @decorate(
    ApiProperty({
      description: '记录最后更新时间',
      type: 'string',
      example: '2022-01-12T07:34:31.000Z',
    }),
  )
  @decorate(UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' }))
  updatedAt: Date
}

export class BaseTimeStamp extends Mixin(CreatedAt, UpdatedAt) {}
