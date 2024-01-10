import type { ISendPhoneCodeBodyDto, ISendPhoneCodeResData } from 'zjf-types'
import { useRequest } from '../composables/request'

const { $post } = useRequest()

/**
 * 发送验证码
 */
export function sendPhoneCodeApi(body: ISendPhoneCodeBodyDto) {
  return $post<ISendPhoneCodeResData>('/phone/code', body)
}
