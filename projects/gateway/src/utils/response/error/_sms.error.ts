import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _permissionErrors: ErrorMessageCollection = {
  [ErrorCode.SMS_SEND_FAIL]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '短信发送失败',
  },
}

export default _permissionErrors
