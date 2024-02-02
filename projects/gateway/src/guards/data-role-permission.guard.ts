import { Reflector } from '@nestjs/core'
import { PermissionType } from 'zjf-types'
import { hasIntersection } from 'zjf-utils'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { RoleService } from 'src/modules/role/role.service'
import { getReflectorValue } from 'src/utils/reflector-value'
import { DataPermissionService, visitorRole } from 'src/modules/data/data-permission/data-permission.service'
import { PermissionGuard } from './permission.guard'

export type DataRolePermissionScope = 'viewDirectories' | 'downloadDirectories'

@Injectable()
export class DataRolePermission extends PermissionGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly roleSrv: RoleService,
    public readonly dataPSrv: DataPermissionService,
  ) {
    super(reflector, roleSrv)
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    await super.validatePermission(req, [], 'AND')

    const queryScopes = getReflectorValue<DataRolePermissionScope[]>(
      this.reflector,
      context,
      'dataRoleScopes',
      ['viewDirectories'],
    )

    const user = req.raw.user

    // 检查用户是否拥有数据管理相关权限，有权限直接返回
    const isAdmin = hasIntersection(
      user?.role?.permissions?.map(v => v.name) ?? [],
      [
        PermissionType.DATA_QUERY,
        PermissionType.DATA_INTRO_QUERY,
      ],
    )

    if (isAdmin) {
      req.dataRole = '*'
      return true
    }

    const dataRoleId = user?.dataRoleId || visitorRole.id
    const dataRole = await this.dataPSrv.repo().findOne({
      where: { id: dataRoleId },
      relations: queryScopes,
    })
    req.dataRole = dataRole

    return true
  }
}

/**
 * 检查当前登录用户的数据角色，并且将信息记录到 req.dataRole
 * @param scopes
 * @returns
 */
export function DataRoleCheck(...scopes: DataRolePermissionScope[]) {
  return applyDecorators(
    UseGuards(DataRolePermission),
    SetMetadata('dataRoleScopes', scopes),
  )
}
