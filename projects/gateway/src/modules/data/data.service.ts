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
      dataDirectory: DataDirectory
      action: LogDataAction
      status: number
      user?: User
      ip: string
    },
  ) {
    // 非表格的下载/预览。不记录
    if (options.dataDirectory?.level !== 4)
      return

    const tableId = options.dataDirectory.id
    const tableName = options.dataDirectory.nameZH
    const module = await this.getDirCache(options.dataDirectory.parentId)
    const subDb = await this.getDirCache(module?.parentId)
    const db = await this.getDirCache(subDb?.parentId)
    const root = await this.getDirCache(db?.parentId)

    const { dataDirectory, ...logOptions } = options

    const log: ILog = {
      ...logOptions,
      target: {
        tableId,
        tableName,
        moduleId: module.id,
        moduleName: module.nameZH,
        subDbId: subDb.id,
        subDbName: subDb.nameZH,
        dbId: db.id,
        dbName: db.nameZH,
        rootId: root.id,
        rootName: root.nameZH,
      },
      time: new Date(),
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
