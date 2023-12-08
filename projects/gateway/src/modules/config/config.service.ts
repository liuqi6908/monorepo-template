import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Config } from 'src/entities/config'

import type { VersionDto } from './dto/version.dto'

@Injectable()
export class SysConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly _sysCfgRepo: Repository<Config>,
  ) {}

  async getConfig(param: VersionDto) {
    return (await this._sysCfgRepo.findOne({
      where: { version: param.version },
      select: ['config'],
    }))?.config
  }

  repo() {
    return this._sysCfgRepo
  }
}
