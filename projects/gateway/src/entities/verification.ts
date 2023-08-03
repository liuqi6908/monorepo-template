import type { IVerificationHistory } from 'zjf-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { VerificationIdentify, VerificationStatus } from 'zjf-types'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from './user'
import { BaseTimeStamp } from './_timestamp'

@Entity()
export class VerificationHistory extends BaseTimeStamp implements IVerificationHistory {
  @ApiProperty({ description: '记录的唯一标识' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '真实姓名' })
  @Column()
  name: string

  @ApiProperty({ description: '身份' })
  @Column({ type: 'enum', enum: VerificationIdentify })
  identify: VerificationIdentify

  @ApiProperty({ description: '上传的附件列表，oss 相对地址列表' })
  @Column({ type: 'simple-array' })
  attachments: string[]

  @ApiProperty({ description: '创建者的用户信息' })
  @ManyToOne(() => User, user => user.founderVerifications)
  @JoinColumn()
  founder: User

  @ApiProperty({ description: '创建者的 id' })
  @Column()
  founderId: User['id']

  @ApiPropertyOptional({ description: '处理者的用户信息' })
  @ManyToOne(() => User, user => user.handlerVerifications)
  @JoinColumn()
  handler?: User

  @ApiPropertyOptional({ description: '处理者的 id' })
  @Column({ nullable: true })
  handlerId?: User['id']

  @ApiPropertyOptional({ description: '当前激活的用户信息' })
  @OneToOne(() => User, user => user.verification)
  user?: User

  @ApiProperty({ description: '处理时间： 通过/驳回/取消' })
  @Column({ nullable: true })
  handledAt?: Date

  @ApiProperty({ description: '认证状态', default: VerificationStatus.PENDING })
  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
  status: VerificationStatus
}
