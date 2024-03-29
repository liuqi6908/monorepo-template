/**
 * 错误码
 */
export enum ErrorCode {
  /** 未知错误 */
  COMMON_UNEXPECTED_ERROR = 100001,
  /** 参数校验错误 */
  COMMON_PARAMS_NOT_VALID = 100002,
  /** 未定义的错误码 */
  COMMON_ERROR_CODE_NOT_DEFINED = 100003,
  /** 未实现的功能 */
  COMMON_NOT_IMPLEMENTED = 100004,
  /** 已废弃的功能 */
  COMMON_DEPRECATED = 100005,

  // ---- 权限相关错误码 ----
  /** 没有相关权限 */
  PERMISSION_DENIED = 300001,
}

export type ErrorMessageCollection = Partial<
  Record<
    ErrorCode,
    {
      httpStatus: import('@nestjs/common').HttpStatus
      message: string
      detail?: any
    }
  >
>
