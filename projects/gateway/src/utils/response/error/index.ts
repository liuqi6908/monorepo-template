import _authErrors from './_auth.error'
import _commonError from './_common.error'
import _dataErrors from './_data.error'
import _desktopErrors from './_desktop.error'
import _exportErrors from './_export.error'
import _fileErrors from './_file.error'
import _permissionErrors from './_permission.error'
import _roleErrors from './_role.error'
import _suggestError from './_suggest.error'
import _userErrors from './_user.error'
import _verificationErrors from './_verification.error'
import _work from './_work.error'

export const errorMessages: ErrorMessageCollection = {
  ..._authErrors,
  ..._commonError,
  ..._dataErrors,
  ..._desktopErrors,
  ..._exportErrors,
  ..._fileErrors,
  ..._permissionErrors,
  ..._roleErrors,
  ..._suggestError,
  ..._userErrors,
  ..._verificationErrors,
  ..._work,
}
