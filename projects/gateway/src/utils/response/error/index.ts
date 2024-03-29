import _commonError from './_common.error'
import _permissionErrors from './_permission.error'

export const errorMessages: ErrorMessageCollection = {
  ..._commonError,
  ..._permissionErrors,
}
