import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ErrorCode, defaultRoles } from 'zjf-types'
import { getRandomPassword } from 'zjf-utils'

import { Role } from 'src/entities/role'
import { responseError } from 'src/utils/response'
import type { RoleIdDto } from 'src/dto/id/role.dto'
import { UserService } from '../user/user.service'
import { PermissionService } from '../permission/permission.service'
import type { UpsertRoleBodyDto } from './dto/upsert-role.body.dto'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepo: Repository<Role>,
    private readonly _userSrv: UserService,
    @Inject(forwardRef(() => PermissionService))
    private readonly _permissionSrv: PermissionService,
  ) {}

  /**
   * 初始化默认角色
   */
  public async initDefaultRoles() {
    // 初始化所有的默认角色
    await this._roleRepo.save(defaultRoles)
    // 将所有超级管理员的角色设置为 root
    await this._userSrv.repo().update({ isSysAdmin: true }, { roleId: defaultRoles[0].id })
  }

  /**
   * 创建/更新角色
   * @param role
   * @returns
   */
  async upsertRole(role: UpsertRoleBodyDto) {
    if (!role.id && await this._roleRepo.findOne({ where: { name: role.name } }))
      responseError(ErrorCode.ROLE_NAME_IS_EXIST)

    if (role.id && defaultRoles.some(v => v.id === role.id))
      responseError(ErrorCode.ROLE_UPDATE_ROOT)
    const permissions = await this._permissionSrv.repo().find({ where: {} })
    const saveInfo: Role = {
      ...role,
      id: role.id || getRandomPassword(26, 26, ''),
      permissions: permissions.filter(v => role.permissions?.includes(v.name)),
    }
    await this._roleRepo.save(saveInfo)
    return saveInfo
  }

  /**
   * 删除角色
   * @param param
   * @returns
   */
  async deleteRole(param: RoleIdDto) {
    if (defaultRoles.some(v => v.id === param.roleId))
      responseError(ErrorCode.ROLE_DELETE_ROOT)
    const deleteRes = await this._roleRepo.delete({ id: param.roleId })
    return deleteRes.affected
  }

  qb(alias = 'r') {
    return this._roleRepo.createQueryBuilder(alias)
  }

  repo() {
    return this._roleRepo
  }
}
