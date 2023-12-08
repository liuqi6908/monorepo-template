import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { In, Not, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { permissionDescriptions } from 'zjf-types'
import { Permission } from 'src/entities/permission'
import { objectEntries, objectKeys } from '@catsjuice/utils'
import type { OnModuleInit } from '@nestjs/common'

import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { RoleService } from '../role/role.service'

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private readonly _permissionRepo: Repository<Permission>,
    @Inject(forwardRef(() => RoleService))
    private readonly _roleSrv: RoleService,
  ) {}

  onModuleInit() {
    this._initPermissions()
  }

  /**
   * 初始化权限列表
   */
  private async _initPermissions() {
    await Promise.all(objectEntries(permissionDescriptions).map(async ([name, description]) => {
      try {
        await this._permissionRepo.save({ name, description })
      }
      catch (err) {
        const sqlError = parseSqlError(err)
        if (sqlError === SqlError.DUPLICATE_ENTRY)
          await this._permissionRepo.update({ name }, { description })
      }
      // 删除不使用的权限
      await this._permissionRepo.delete({ name: Not(In(objectKeys(permissionDescriptions))) })
    }))

    await this._roleSrv.initDefaultRoles()
  }

  repo() {
    return this._permissionRepo
  }
}
