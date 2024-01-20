import { getRandomPassword } from './random-password'

/**
 * 生成指定长度的随机ID
 * @param len 指定长度
 * @default
 *  len 16
 * @return 生成的随机ID
 */
export function getRandomID(len = 16) {
  return getRandomPassword(len, len, '')
}
