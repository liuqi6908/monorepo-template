import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'zjf-types'

const _roleErrors: ErrorMessageCollection = {
  [ErrorCode.ROLE_DELETE_ROOT]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: 'root权限不可删除',
  },
  [ErrorCode.ROLE_UPDATE_ROOT]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: 'root权限不可更新',
  },
  [ErrorCode.ROLE_IN_USAGE]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '权限已被分配',
  },
  [ErrorCode.ROLE_NAME_IS_EXIST]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '权限名称已存在',
  },
  [ErrorCode.ROLE_UPDATE_ROOT_ROLE]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: 'root用户的权限不可更改',
  },
}

export default _roleErrors
