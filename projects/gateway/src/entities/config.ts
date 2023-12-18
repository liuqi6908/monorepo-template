import { SysConfig } from 'zjf-types'
import type { IConfigDto, ISysConfig } from 'zjf-types'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Config implements ISysConfig<SysConfig> {
  @PrimaryColumn({
    type: 'enum',
    enum: SysConfig,
  })
  version: SysConfig

  @Column({
    type: 'json',
    nullable: true,
  })
  config?: IConfigDto[SysConfig]
}
