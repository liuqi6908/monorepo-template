import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ModuleRef } from '@nestjs/core'
import type { OnModuleInit } from '@nestjs/common'
import type { ILog, LogDataAction } from 'zjf-types'
import type { User } from 'src/entities/user'

import { DataField } from 'src/entities/data-field'
import { DataDirectory } from 'src/entities/data-directory'
import { LogService } from '../log/log.service'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class DataService implements OnModuleInit {
  constructor(
    @InjectRepository(DataDirectory)
    private readonly _dataDirRepo: Repository<DataDirectory>,

    @InjectRepository(DataField)
    private readonly _dataFieldRepo: Repository<DataField>,

    private readonly _redisSrv: RedisService,
    private readonly _modRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.cacheDir()
  }

  /**
   * 缓存数据目录
   */
  async cacheDir() {
    const client = await this._redisSrv.getClient(RedisType.DATA_DIR_CACHE)

    // 先清空缓存 （只清空当前 db）
    await client.flushDb()

    // 写入新的缓存
    const dirs = await this._dataDirRepo.find()
    dirs.forEach(dir => client.set(dir.id, JSON.stringify(dir)))
  }

  /**
   * 获取数据目录的缓存
   * @param id
   * @returns
   */
  async getDirCache(id: string) {
    const client = await this._redisSrv.getClient(RedisType.DATA_DIR_CACHE)
    const dir = await client.get(id)
    try {
      return JSON.parse(dir)
    }
    catch (e) {
      return null
    }
  }

  /**
   * 保存日志
   * @param options
   * @returns
   */
  public async saveLog(
    options: {
      dataDirectory?: DataDirectory
      action: LogDataAction
      status: number
      user?: User
      ip: string
    },
  ) {
    const { dataDirectory, ...logOptions } = options
    // 非表格的下载/预览。不记录
    if (dataDirectory?.level !== 4)
      return

    const { id, nameZH } = dataDirectory
    const log: ILog = {
      ...logOptions,
      target: {
        tableId: id,
        tableName: nameZH,
      },
      time: new Date(),
    }

    let data = dataDirectory
    if (data.parentId) {
      while (true) {
        data = await this.getDirCache(data.parentId)
        const { id, level, nameZH, parentId } = data ?? {}
        if (level === 0) {
          log.target.rootId = id
          log.target.rootName = nameZH
        }
        else if (level === 1) {
          log.target.dbId = id
          log.target.dbName = nameZH
        }
        else if (level === 2) {
          log.target.subDbId = id
          log.target.subDbName = nameZH
        }
        else if (level === 3) {
          log.target.moduleId = id
          log.target.moduleName = nameZH
        }

        if (!parentId || level === 0)
          break
      }
    }

    const logSrv = this._modRef.get(LogService, { strict: false })
    logSrv.log(log)
  }

  dirQB(alias = 'dd') {
    return this._dataDirRepo.createQueryBuilder(alias)
  }

  fieldQB(alias = 'df') {
    return this._dataFieldRepo.createQueryBuilder(alias)
  }

  dirRepo() {
    return this._dataDirRepo
  }

  fieldRepo() {
    return this._dataFieldRepo
  }
}
