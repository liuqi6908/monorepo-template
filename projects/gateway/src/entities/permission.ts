import { PermissionType } from 'zjf-types'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import type { IPermission } from 'zjf-types'
import { Role } from './role'

@Entity()
export class Permission implements IPermission {
  @ApiProperty({ description: '权限名称，作为权限的唯一标识' })
  @PrimaryColumn()
  name: PermissionType

  @ApiProperty({ description: '权限描述' })
  @Column()
  description?: string

  @ManyToMany(() => Role, role => role.permissions, { onDelete: 'CASCADE' })
  roles?: Role[]
}
