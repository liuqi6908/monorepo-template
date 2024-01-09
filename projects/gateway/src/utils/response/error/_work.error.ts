import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _permissionErrors: ErrorMessageCollection = {
  [ErrorCode.WORK_QUANTITY_OVER_LIMIT]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '作品数量超出指定上限',
  },
}

export default _permissionErrors
