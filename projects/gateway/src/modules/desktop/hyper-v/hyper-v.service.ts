import { EventEmitter } from 'node:stream'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import type { AxiosResponse } from 'axios'
import type { HyperVConfig } from 'src/config/_hyper-v.config'
import { sha512 } from 'src/utils/encrypt/sha512'
import { rsaEncrypt } from 'src/utils/rsa'

@Injectable()
export class HyperVService extends EventEmitter {
  private _oauth = {
    token: '',
    expireAt: 0,
  }

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _httpSrv: HttpService,
  ) {
    super()
  }

  /**
   * 登录hyperV
   */
  private async _login() {
    const { host, user, password } = this._cfgSrv.get<HyperVConfig>('hyperV')

    const getCfg = (token: string) => ({
      config: {
        baseURL: host,
        headers: { Authorization: token },
      },
    })

    if (this._oauth.token && this._oauth.expireAt > Date.now())
      return getCfg(this._oauth.token)

    const res = await this._httpSrv.axiosRef({
      method: 'POST',
      url: '/v1/auth/login',
      data: {
        accountName: user,
        password: sha512(password),
      },
      baseURL: host,
    })

    const token = res.data?.data?.token

    if (!token)
      throw new Error('登录失败')

    this._oauth = {
      token,
      expireAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }

    return getCfg(token)
  }

  /**
   * 带会话的请求
   */
  public requestWithSession<T = any>(
    request: (axiosCfg) => Promise<AxiosResponse<T>>,
  ) {
    return new Promise<T>((resolve, reject) => {
      this._login().then(
        ({ config }) =>
          request(config)
            .then((res) => {
              const { code, msg, data } = res.data as any
              if (code === 200) {
                resolve(data)
              }
              else {
                throw new HttpException(
                  { status: code, message: msg },
                  HttpStatus.BAD_REQUEST,
                )
              }
            })
            .catch(reject),
      ).catch(reject)
    })
  }

  /**
   * 获取云桌面虚拟机列表
   */
  public async vmList() {
    return await this.requestWithSession((cfg) => {
      return this._httpSrv.axiosRef({
        ...cfg,
        method: 'Get',
        url: '/v1/vm',
      })
    })
  }

  /**
   * 操作指定的虚拟机
   */
  public async operateVM(vmUUID: string, action: 'start' | 'stop' | 'reboot') {
    return await this.requestWithSession((cfg) => {
      return this._httpSrv.axiosRef({
        ...cfg,
        method: 'PUT',
        url: `/v1/vm/${vmUUID}/action`,
        data: { action },
      })
    })
  }

  /**
   * 查询虚拟机状态
   */
  public async getVMState(vmUUID: string) {
    return await this.requestWithSession((cfg) => {
      return this._httpSrv.axiosRef({
        ...cfg,
        method: 'GET',
        url: `/v1/vm/${vmUUID}`,
      })
    })
  }

  /**
   * 同步域用户
   */
  public async syncDomainUser(user: string, password: string) {
    try {
      return await this.requestWithSession((cfg) => {
        return this._httpSrv.axiosRef({
          ...cfg,
          method: 'PUT',
          url: '/v1/user/set',
          data: {
            user,
            password: rsaEncrypt(password),
          },
        })
      })
    }
    catch (_) {}
  }
}
