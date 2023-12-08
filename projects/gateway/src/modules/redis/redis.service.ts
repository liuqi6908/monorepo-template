import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from 'redis'
import type { RedisClientType } from 'redis'

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name)
  private _clients: Map<string, RedisClientType> = new Map()

  constructor(
    private readonly _cfgSrv: ConfigService,
  ) {}

  public async getClient(redisType: RedisType) {
    const { key, url }
      = this._cfgSrv.get<Record<string, any>>(`redis.${redisType}`) || {}
    if (!key || !url)
      return
    const client = this._clients.get(key)
    if (!client) {
      const _client = createClient({ url })
      _client.connect()
      this._clients.set(key, _client as any)
      this.logger.log('New Redis connection created: ', key)
      return _client as RedisClientType
    }
    return client
  }

  /**
   * 处理所有连接
   * @returns
   */
  public async disposeAllConnection() {
    return Promise.all(
      Array.from(this._clients.keys()).map(
        async key => await this._clients.get(key).quit(),
      ),
    )
  }
}
