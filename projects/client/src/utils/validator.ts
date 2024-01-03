import {
  VERIFICATION_COLLEGE_MAX,
  VERIFICATION_ID_CARD_MAX,
  VERIFICATION_ID_CARD_MIN,
  VERIFICATION_NUMBER_MAX,
  VERIFICATION_SCHOOL_MAX,
} from 'zjf-types'

/**
 * 校验学校名称
 */
export function validateSchool(val?: string) {
  if (!val)
    return '请输入学校名称'
  if (val.length > VERIFICATION_SCHOOL_MAX)
    return `学校名称长度不得大于 ${VERIFICATION_SCHOOL_MAX}`
  return ''
}

/**
 * 校验学院名称
 */
export function validateCollege(val?: string) {
  if (!val)
    return '请输入学院名称'
  if (val.length > VERIFICATION_COLLEGE_MAX)
    return `学院名称长度不得大于 ${VERIFICATION_COLLEGE_MAX}`
  return ''
}

/**
 * 校验身份证号码
 */
export function validateIdCard(val?: string) {
  if (!val)
    return '请输入身份证号码'
  if (val.length < VERIFICATION_ID_CARD_MIN)
    return `身份证号码长度不得小于 ${VERIFICATION_ID_CARD_MIN}`
  if (val.length > VERIFICATION_ID_CARD_MAX)
    return `身份证号码长度不得大于 ${VERIFICATION_ID_CARD_MAX}`
  return ''
}

/**
 * 校验学号/工号
 */
export function validateNumber(val?: string) {
  if (!val)
    return '请输入学号/工号'
  if (val.length > VERIFICATION_NUMBER_MAX)
    return `学号/工号长度不得大于 ${VERIFICATION_NUMBER_MAX}`
  return ''
}

/**
 * 校验姓名
 */
export function validateName(val?: string) {
  if (!val)
    return '请输入您的真实姓名'
  return ''
}
