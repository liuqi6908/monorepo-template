import type { ISendEmailCodeBodyDto, ISendEmailCodeResData } from 'zjf-types'
import { useRequest } from '~/composables'

const { $post } = useRequest()

/**
 * 发送验证码
 */
export function sendCodeApi(body: ISendEmailCodeBodyDto) {
  return $post<ISendEmailCodeResData>('/email/code', body)
}
