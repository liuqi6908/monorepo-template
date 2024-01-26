import moment from 'moment'
import { ref } from 'vue'
import { PAGINATION_SIZE_DFT } from 'zjf-types'
import { formatFileSize } from 'zjf-utils'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IFileExportBasic } from 'zjf-types'

/**
 * 返回表格分页配置
 */
export function TABLE_PAGINATION() {
  return ref<Exclude<QTableProps['pagination'], undefined>>({
    page: 1,
    rowsPerPage: PAGINATION_SIZE_DFT,
    rowsNumber: 0,
  })
}

/**
 * 文件外发表格基础字段
 */
export const EXPORT_TABLE_COLUMNS: QTableColumn<IFileExportBasic>[] = [
  {
    name: 'account',
    label: '用户',
    field: row => row.founder?.account,
  },
  {
    name: 'email',
    label: '邮箱',
    field: 'email',
  },
  {
    name: 'name',
    label: '姓名',
    field: row => row.founder?.verification?.name,
  },
  {
    name: 'ip',
    label: '外发IP',
    field: 'ip',
  },
  {
    name: 'fileName',
    label: '文件名',
    field: 'fileName',
  },
  {
    name: 'fileSize',
    label: '文件大小',
    field: row => formatFileSize(row.fileSize),
  },
  {
    name: 'note',
    label: '备注信息',
    field: 'note',
  },
  {
    name: 'createdAt',
    label: '外发时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  },
]
