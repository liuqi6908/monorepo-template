import { ErrorCode } from 'zjf-types'
import { In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getRandomPassword } from 'zjf-utils'
import type { OnModuleInit } from '@nestjs/common'
import type { DataRoleIdDto } from 'src/dto/id/data-role.dto'

import { DataRole } from 'src/entities/data-role'
import { responseError } from 'src/utils/response'
import { DataService } from '../data.service'
import type { UpsertDataRoleBodyDto } from './dto/upsert-data-role.body.dto'

export const visitorRole: DataRole = {
  id: 'visitor',
  name: '访客',
  description: '未登录的用户',
}

@Injectable()
export class DataPermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(DataRole)
    private readonly _dataRoleRepo: Repository<DataRole>,
    private readonly _dataSrv: DataService,
  ) {}

  onModuleInit() {
    this._dataRoleRepo.save(visitorRole)
  }

  /**
   * 删除数据下载角色
   * @param param
   * @returns
   */
  async deleteRole(param: DataRoleIdDto) {
    if (param.dataRoleId === visitorRole.id)
      responseError(ErrorCode.DATA_PERMISSION_DELETE_VISITOR)
    const deleteRes = await this._dataRoleRepo.delete({ id: param.dataRoleId })
    return deleteRes.affected
  }

  /**
   * 创建/更新数据下载角色
   * @param role
   * @returns
   */
  async upsertDataRole(role: UpsertDataRoleBodyDto) {
    if (!role.id && await this._dataRoleRepo.findOne({ where: { name: role.name } }))
      responseError(ErrorCode.DATA_ROLE_NAME_IS_EXIST)

    const mapId = (arr: string[]) => arr.map(id => ({ id }))

    role.viewableDirectoryIds = Array.from(
      new Set([
        ...(role.viewableDirectoryIds || []),
        ...(role.downloadableDirectoryIds || []),
      ]),
    )

    // 去除无效的目录id
    const dirs = await this._dataSrv.dirRepo().find({
      where: { id: In(role.viewableDirectoryIds) },
    })
    const availableIdsMap = dirs.reduce((map, dir) => {
      map[dir.id] = true
      return map
    }, {} as Record<string, boolean>)

    role.viewableDirectoryIds = role.viewableDirectoryIds.filter(id => availableIdsMap[id])
    role.downloadableDirectoryIds = role.downloadableDirectoryIds.filter(id => availableIdsMap[id])

    const saveInfo: Partial<Record<keyof DataRole, any>> = {
      id: role.id || getRandomPassword(26, 26, ''),
      name: role.name,
      description: role.description || '',
      select: role.select || false,
      sort: role.sort || 0,
      viewDirectories: mapId(role.viewableDirectoryIds || []),
      downloadDirectories: mapId(role.downloadableDirectoryIds || []),
    }

    await this._dataRoleRepo.save(saveInfo)

    return saveInfo
  }

  qb(alias = 'dr') {
    return this._dataRoleRepo.createQueryBuilder(alias)
  }

  repo() {
    return this._dataRoleRepo
  }
}
