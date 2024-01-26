import { ApiProperty } from '@nestjs/swagger'
import { Column, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import type { IDataDirectory } from 'zjf-types'
import { DataRole } from './data-role'
import { DataField } from './data-field'
import { DataSuggestion } from './data-suggestion'

@Entity()
export class DataDirectory implements IDataDirectory {
  @ApiProperty({ description: '目录的唯一标识' })
  @PrimaryColumn()
  id: string

  /** 名称 */
  @ApiProperty({ description: '中文名称' })
  @Column()
  nameZH: string

  @ApiProperty({ description: '英文名称' })
  @Column()
  nameEN: string

  @ApiProperty({ type: () => [DataDirectory], description: '子目录' })
  @OneToMany(() => DataDirectory, directory => directory.parent, {
    onDelete: 'CASCADE',
  })
  children?: DataDirectory[]

  @ApiProperty({ description: '父目录', type: () => DataDirectory })
  @ManyToOne(() => DataDirectory, directory => directory.children, {
    onDelete: 'CASCADE',
  })
  parent?: DataDirectory

  @ApiProperty({ description: '所属的目录 id' })
  @Column({ nullable: true })
  parentId?: string

  @ApiProperty({ description: '字段' })
  @OneToMany(() => DataField, field => field.directory, {
    onDelete: 'CASCADE',
  })
  fields?: DataField[]

  @ApiProperty({ description: '根目录的唯一标识（方便快速删除指定的大类）' })
  @Column()
  rootId?: string

  @ApiProperty({ description: '目录的层级' })
  @Column()
  level: number

  @ApiProperty({ description: '排序' })
  @Column()
  order?: number

  @ApiProperty({ description: '当前数据目录的路径' })
  @Column({ type: 'simple-array', nullable: true })
  path?: string[]

  @ApiProperty({ description: '引用规范' })
  @Column({ nullable: true })
  reference?: string

  @ApiProperty({ description: '拥有查看权限的数据角色列表' })
  @ManyToMany(() => DataRole, role => role.viewDirectories, {
    onDelete: 'CASCADE',
  })
  viewDataRoles?: DataRole[]

  @ApiProperty({ description: '拥有下载权限的数据角色列表' })
  @ManyToMany(() => DataRole, role => role.downloadDirectories, {
    onDelete: 'CASCADE',
  })
  downloadDataRoles?: DataRole[]

  @ApiProperty({ description: '用户发起的建议' })
  @OneToMany(() => DataSuggestion, sug => sug.dataDirectory, {
    onDelete: 'CASCADE',
  })
  suggestions?: DataSuggestion[]

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date
}
