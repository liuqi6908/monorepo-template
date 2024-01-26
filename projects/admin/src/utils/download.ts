import moment from 'moment'
import { Notify, exportFile } from 'quasar'
import type { QTableColumn, QTableProps } from 'quasar'

/**
 * 下载表格数据
 */
export function downloadTableData(
  cols: QTableColumn[],
  rows: QTableProps['rows'],
  filename: string,
) {
  const content = [cols.map(col => `"${col.label}"`)].concat(
    rows?.map(row => cols.map((col) => {
      if (typeof col.field === 'string')
        return `"${row[col.field] ?? ''}"`
      else
        return `"${col.field(row) ?? ''}"`
    }).join(',')) ?? [],
  ).join('\r\n')

  const status = exportFile(
    `${filename} ${moment().format('YYYY-MM-DD HH-mm-ss')}.csv`,
    content,
    'text/csv',
  )

  if (status === true) {
    Notify.create({
      type: 'success',
      message: '导出成功',
    })
  }
  else {
    Notify.create({
      type: 'danger',
      message: '导出失败',
    })
  }
}
