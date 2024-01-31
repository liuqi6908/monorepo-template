import {
  VERIFICATION_REJECT_REASON_MAX,
  VERIFICATION_REJECT_REASON_MIN,
} from 'zjf-types'

export const REJECT_REASON_REQUIREMENTS_DESC = `驳回理由长度不得小于 ${VERIFICATION_REJECT_REASON_MIN} 位，不得大于 ${VERIFICATION_REJECT_REASON_MAX} 位`

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
