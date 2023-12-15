import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ErrorCode, PermissionType } from 'zjf-types'
import { DataRoleIdDto } from 'src/dto/id/data-role.dto'

import { HasPermission } from 'src/guards/permission.guard'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { ApiSuccessResponse, responseError } from 'src/utils/response'

import { DataPermissionService } from './data-permission.service'
import { DataRoleDetailResDto } from './dto/data-role-detail.res.dto'
import { UpsertDataRoleBodyDto } from './dto/upsert-data-role.body.dto'

@ApiTags('DataPermission | 数据权限管理')
@Controller('data-permission')
export class DataPermissionController {
  constructor(
    private readonly _dataPSrv: DataPermissionService,
  ) {}

  @ApiOperation({
    summary: '创建/更新数据下载角色',
    description: 'id为数据角色名称的唯一标识，如果id存在，则会更新角色信息',
  })
  @HasPermission([PermissionType.DATA_PERMISSION_CREATE, PermissionType.DATA_PERMISSION_UPDATE], 'AND')
  @Post('data-role/upsert')
  public async createRole(@Body() body: UpsertDataRoleBodyDto) {
    return await this._dataPSrv.upsertDataRole(body)
  }

  @ApiOperation({
    summary: '删除数据下载角色（同时删除绑定的 directory）',
    description: '删除数据下载角色，如果角色已关联用户，则会删除失败',
  })
  @HasPermission(PermissionType.DATA_PERMISSION_DELETE)
  @Delete('data-role/:dataRoleId')
  public async deleteRole(@Param() param: DataRoleIdDto) {
    try {
      return await this._dataPSrv.deleteRole(param)
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.DATA_ROLE_IN_USAGE)
      throw e
    }
  }

  @ApiOperation({ summary: '列出所有数据下载角色' })
  @HasPermission(PermissionType.DATA_PERMISSION_QUERY)
  @ApiQuery({ name: 'permission', description: '是否关联查询所有的权限列表，传入任意值即可' })
  @Get('data-role/list')
  public async listDataRole(
    @Query('permission') permission: string,
  ) {
    return (await this._dataPSrv.repo().find({
      relations: permission
        ? { downloadDirectories: true, viewDirectories: true }
        : {},
    })).sort((a, b) => a.sort - b.sort)
  }

  @ApiOperation({ summary: '查询所有数据下载角色名称' })
  @Get('data-role/names')
  public async dataRoleNames() {
    return (await this._dataPSrv.repo().find({
      where: {
        select: true,
      },
    })).sort((a, b) => a.sort - b.sort).map(v => v.name)
  }

  @ApiOperation({ summary: '查询指定的数据下载角色详情' })
  @ApiSuccessResponse(DataRoleDetailResDto)
  @HasPermission(PermissionType.DATA_PERMISSION_QUERY)
  @Get('data-role/:dataRoleId')
  public async getDataRole(@Param() param: DataRoleIdDto) {
    return await this._dataPSrv.repo().findOne({
      where: { id: param.dataRoleId },
      relations: { downloadDirectories: true, viewDirectories: true },
    })
  }
}
