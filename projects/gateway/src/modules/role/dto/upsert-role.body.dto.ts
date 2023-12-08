import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PermissionType } from 'zjf-types'
import type { IUpsertRoleBodyDto } from 'zjf-types'

export class UpsertRoleBodyDto implements IUpsertRoleBodyDto {
  @ApiPropertyOptional({ description: '角色的唯一标识' })
  @IsString()
  @IsOptional()
  id?: string

  @ApiProperty({ description: '角色名称', example: '测试角色' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '角色描述', example: '测试角色的描述信息' })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    description: '权限列表',
    example: [PermissionType.ACCOUNT_CREATE],
  })
  @IsArray()
  @IsEnum(
    PermissionType,
    {
      each: true,
      message: 'permissions 中的每个值必须是 PermissionType 枚举值',
    },
  )
  @Type(() => String)
  @IsOptional()
  permissions?: PermissionType[]
}
