import type { QNotifyUpdateOptions } from 'quasar'

/**
 * 展示上传结果
 */
export function showUploadResult(
  total: number, success: number, error: Record<number | string, string>,
  notify: (props?: QNotifyUpdateOptions | undefined) => void,
  callback?: () => void,
) {
  if (!total) {
    notify({
      type: 'warn',
      message: '暂无数据',
      caption: undefined,
    })
  }
  else if (!success) {
    notify({
      type: 'danger',
      message: `共 ${total} 条数据，全部上传失败`,
      caption: Object.keys(error).map((v: string) => {
        const label = Number.isNaN(Number(v)) ? v : `第 ${v} 条`
        return `${label}：${error[v]}`
      }).join('<br/>'),
      multiLine: true,
      html: true,
      timeout: 0,
      actions: [
        { label: '确认', color: 'white', handler: () => { } },
      ],
    })
  }
  else if (success === total) {
    notify({
      type: 'success',
      message: `已成功上传 ${success} 条数据`,
      caption: undefined,
    })
  }
  else {
    notify({
      type: 'warn',
      message: `共 ${total} 条数据，已成功上传 ${success} 条`,
      caption: Object.keys(error).map((v: string) => {
        const label = Number.isNaN(Number(v)) ? v : `第 ${v} 条`
        return `${label}：${error[v]}`
      }).join('<br/>'),
      multiLine: true,
      html: true,
      timeout: 0,
      actions: [
        { label: '确认', color: 'white', handler: () => { } },
      ],
    })
  }

  if (success && callback)
    callback()
}
