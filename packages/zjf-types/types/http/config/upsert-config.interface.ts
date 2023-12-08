import { ISysConfig } from '../../entities/sys-config.interface'

export type IUpsertConfigBodyDto = ISysConfig['export'] & {
  /** 配置版本 */
  version: string
}
