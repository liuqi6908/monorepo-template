import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ErrorCode, PermissionType } from 'zjf-types'

import { HasPermission } from 'src/guards/permission.guard'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { responseError } from 'src/utils/response'
import { RoleIdDto } from 'src/dto/id/role.dto'
import { RoleService } from './role.service'
import { UpsertRoleBodyDto } from './dto/upsert-role.body.dto'

@ApiTags('Role | 角色')
@Controller('role')
export class RoleController {
  constructor(
    private readonly _roleSrv: RoleService,
  ) {}

  @ApiOperation({ summary: '获取全部角色列表' })
  @HasPermission([
    PermissionType.ROLE_QUERY,
    PermissionType.ROLE_ASSIGN_QUERY,
  ])
  @Get('list')
  public async getRoles() {
    return this._roleSrv.repo().find({
      where: {},
      relations: { permissions: true },
    })
  }

  @ApiOperation({
    summary: '创建/更新角色',
    description: 'id为角色的唯一标识，如果id存在，则会更新角色信息',
  })
  @HasPermission([PermissionType.ROLE_CREATE, PermissionType.ROLE_UPDATE], 'AND')
  @Post('upsert')
  public async upsertRole(@Body() body: UpsertRoleBodyDto) {
    return await this._roleSrv.upsertRole(body)
  }

  @ApiOperation({
    summary: '删除角色',
    description: '删除角色时，如果角色已关联用户，则会删除失败',
  })
  @HasPermission(PermissionType.ROLE_DELETE)
  @Delete(':roleId')
  public async deleteRole(
    @Param() param: RoleIdDto,
  ) {
    try {
      return await this._roleSrv.deleteRole(param)
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ROLE_IN_USAGE)
      throw e
    }
  }

  @ApiOperation({
    summary: '批量删除角色',
    description: '删除角色时，如果角色已关联用户，则会删除失败',
  })
  @HasPermission(PermissionType.ROLE_DELETE)
  @Delete('batch')
  public async batchDeleteRole(
    @Body() body: RoleIdDto['roleId'][],
  ) {
    if (body.length === 1)
      return await this.deleteRole({ roleId: body[0] })

    let success = 0
    for (const id of body) {
      try {
        const deleteRes = await this._roleSrv.deleteRole({ roleId: id })
        success += deleteRes
      }
      catch (_) {}
    }
    return success
  }
}
