import { Notify } from 'quasar'

/**
 * 将回调函数包装在loading类型的Notify中
 */
export async function loadingNotify<T = any>(
  callback: () => T,
  loadingText = '正在加载中...',
  successText = '执行成功',
  errorText = '执行失败',
): Promise<T | undefined> {
  const notify = Notify.create({
    type: 'loading',
    message: loadingText,
  })
  try {
    const res = await callback()
    notify({
      type: 'success',
      message: successText,
    })
    return res
  }
  catch (e: any) {
    notify({
      type: 'danger',
      message: e?.errorMessage || errorText,
    })
  }
}
