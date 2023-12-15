import { IConfigDto } from 'zjf-types'
import type { ISysConfig } from 'zjf-types'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Config implements ISysConfig {
  @PrimaryColumn()
  version: string

  @Column({ type: 'json' })
  config: IConfigDto
}
