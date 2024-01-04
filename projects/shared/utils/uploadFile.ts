import { Notify } from 'quasar'
import type { QRejectedEntry } from 'quasar'

/**
 * 选择文件，未通过验证的回调
 */
export function onRejected(e: QRejectedEntry[]) {
  if (e.length) {
    const { failedPropValidation } = e[0]
    if (failedPropValidation === 'accept') {
      Notify.create({
        type: 'danger',
        message: '不支持的文件类型',
      })
    }
    else if (failedPropValidation === 'filter') {
      Notify.create({
        type: 'danger',
        message: '不允许的文件',
      })
    }
    else if (
      failedPropValidation === 'max-file-size'
      || failedPropValidation === 'max-total-size'
    ) {
      Notify.create({
        type: 'danger',
        message: '超出限定的文件大小',
      })
    }
    else if (failedPropValidation === 'duplicate') {
      Notify.create({
        type: 'danger',
        message: '重复上传的文件',
      })
    }
  }
}
