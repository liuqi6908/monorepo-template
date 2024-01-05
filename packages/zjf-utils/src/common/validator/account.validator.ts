import { isStartWithNumber } from './tool.validator'

export const ROOT_ACCOUNT = 'zjf_root_admin'
export const ACCOUNT_MAX_LENGTH = 16
export const ACCOUNT_MIN_LENGTH = 2
export const ACCOUNT_ALLOW_CHARS = ''
export const ACCOUNT_REQUIREMENTS_DESC = `账号长度不得小于 ${ACCOUNT_MIN_LENGTH} 位，不得大于 ${ACCOUNT_MAX_LENGTH} 位, 由大小写字母和数字组成，且不能以数字开头`

/**
 * 校验一个账号是否符合要求，如果符合要求，返回空字符串，否则返回错误信息
 * @param account 账号
 * @returns
 */
export function validateAccount(account: string) {
  if (account === ROOT_ACCOUNT)
    return
  if (isStartWithNumber(account))
    return '账号不能以数字开头'
  if (account.length < ACCOUNT_MIN_LENGTH)
    return `账号长度不得小于 ${ACCOUNT_MIN_LENGTH}`
  if (account.length > ACCOUNT_MAX_LENGTH)
    return `账号长度不得大于 ${ACCOUNT_MAX_LENGTH}`

  // 检测特殊字符
  const specialChars = account.split('').filter(char => !/[a-zA-Z0-9]/.test(char))
  const notAllowedChar = specialChars.find(char => !ACCOUNT_ALLOW_CHARS.includes(char))
  if (notAllowedChar)
    return `特殊字符 “${notAllowedChar}” 不被允许`
  return ''
}
