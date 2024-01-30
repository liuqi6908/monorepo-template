import {
  VERIFICATION_COLLEGE_MAX,
  VERIFICATION_ID_CARD_MAX,
  VERIFICATION_ID_CARD_MIN,
  VERIFICATION_NAME_MAX,
  VERIFICATION_NAME_MIN,
  VERIFICATION_NUMBER_MAX,
  VERIFICATION_REJECT_REASON_MAX,
  VERIFICATION_REJECT_REASON_MIN,
  VERIFICATION_SCHOOL_MAX,
} from 'zjf-types'

export const SCHOOL_REQUIREMENTS_DESC = `学校名称长度不得大于 ${VERIFICATION_SCHOOL_MAX} 位`
export const COLLEGE_REQUIREMENTS_DESC = `学院名称长度不得大于 ${VERIFICATION_COLLEGE_MAX} 位`
export const ID_CARD_REQUIREMENTS_DESC = `身份证号码长度不得小于 ${VERIFICATION_ID_CARD_MIN} 位，不得大于 ${VERIFICATION_ID_CARD_MAX} 位`
export const NUMBER_REQUIREMENTS_DESC = `学号/工号长度不得大于 ${VERIFICATION_NUMBER_MAX} 位`
export const NAME_REQUIREMENTS_DESC = `姓名长度不得小于 ${VERIFICATION_NAME_MIN} 位，不得大于 ${VERIFICATION_NAME_MAX} 位`
export const REJECT_REASON_REQUIREMENTS_DESC = `驳回理由长度不得小于 ${VERIFICATION_REJECT_REASON_MIN} 位，不得大于 ${VERIFICATION_REJECT_REASON_MAX} 位`

/**
 * 校验学校名称
 */
export function validateSchool(val?: string) {
  if (!val)
    return '请输入学校名称'
  if (val.length > VERIFICATION_SCHOOL_MAX)
    return SCHOOL_REQUIREMENTS_DESC
  return ''
}

/**
 * 校验学院名称
 */
export function validateCollege(val?: string) {
  if (!val)
    return '请输入学院名称'
  if (val.length > VERIFICATION_COLLEGE_MAX)
    return COLLEGE_REQUIREMENTS_DESC
  return ''
}

/**
 * 校验身份证号码
 */
export function validateIdCard(val?: string) {
  if (!val)
    return '请输入身份证号码'
  if (val.length < VERIFICATION_ID_CARD_MIN)
    return `身份证号码长度不得小于 ${VERIFICATION_ID_CARD_MIN} 位`
  if (val.length > VERIFICATION_ID_CARD_MAX)
    return `身份证号码长度不得大于 ${VERIFICATION_ID_CARD_MAX} 位`
  return ''
}

/**
 * 校验学号/工号
 */
export function validateNumber(val?: string) {
  if (!val)
    return '请输入学号/工号'
  if (val.length > VERIFICATION_NUMBER_MAX)
    return NUMBER_REQUIREMENTS_DESC
  return ''
}

/**
 * 校验姓名
 */
export function validateName(val?: string) {
  if (!val)
    return '请输入您的真实姓名'
  if (val.length < VERIFICATION_NAME_MIN)
    return `姓名长度不得小于 ${VERIFICATION_NAME_MIN} 位`
  if (val.length > VERIFICATION_NAME_MAX)
    return `姓名长度不得大于 ${VERIFICATION_NAME_MAX} 位`
  return ''
}

/**
 * 校验驳回理由
 */
export function validateRejectReason(val?: string) {
  if (!val)
    return '请输入驳回理由'
  if (val.length < VERIFICATION_REJECT_REASON_MIN)
    return `驳回理由长度不得小于 ${VERIFICATION_REJECT_REASON_MIN} 位`
  if (val.length > VERIFICATION_REJECT_REASON_MAX)
    return `驳回理由长度不得大于 ${VERIFICATION_REJECT_REASON_MAX} 位`
  return ''
}
