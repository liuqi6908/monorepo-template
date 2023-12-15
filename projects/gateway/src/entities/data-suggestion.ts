import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import type { IDataSuggestion } from 'zjf-types'
import { User } from './user'
import { DataDirectory } from './data-directory'
import { BaseTimeStamp } from './_timestamp'

// 每个用户对每个数据目录只能有一个建议
@Unique('userDirectory', ['userId', 'dataDirectoryId'])
@Entity()
export class DataSuggestion
  extends BaseTimeStamp
  implements IDataSuggestion {
  @ApiProperty({ description: '数据建议的唯一标识' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '建议的数据目录信息' })
  @ManyToOne(() => DataDirectory,
    dir => dir.suggestions,
    { eager: true, onDelete: 'CASCADE' },
  )
  dataDirectory: DataDirectory

  @ApiProperty({ description: '建议的数据目录 id' })
  @Column()
  dataDirectoryId: string

  @ApiProperty({ description: '建议的原因' })
  @Column()
  reason?: string

  @ApiProperty({ description: '用户信息' })
  @ManyToOne(() => User, user => user.suggestions)
  user: User

  @ApiProperty({ description: '用户 id' })
  @Column()
  userId: string
}
