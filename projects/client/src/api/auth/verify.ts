import type { IVerificationHistory } from 'zjf-types'

const { $get } = useRequest()

/**
 * 获取最近一次的申请认证记录
 * @returns
 */
export function getVerify() {
  return $get<IVerificationHistory>('/verification/latest')
}
