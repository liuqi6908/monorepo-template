import moment from 'moment'
import { ref } from 'vue'
import { PAGINATION_SIZE_DFT } from 'zjf-types'
import { formatFileSize } from 'zjf-utils'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IDataDirectory, IDesktop, IDesktopQueue, IFileExportBasic, IUser } from 'zjf-types'

/**
 * 返回表格分页配置
 */
export function TABLE_PAGINATION(sortBy?: string, descending?: boolean) {
  return ref<Exclude<QTableProps['pagination'], undefined>>({
    page: 1,
    rowsPerPage: PAGINATION_SIZE_DFT,
    rowsNumber: 0,
    sortBy,
    descending,
  })
}

/**
 * 用户表格基础字段
 */
export const USER_TABLE_COLUMNS: QTableColumn<IUser>[] = [
  {
    name: 'account',
    label: '用户',
    field: 'account',
  },
  {
    name: 'email',
    label: '邮箱',
    field: 'email',
  },
  {
    name: 'name',
    label: '姓名',
    field: row => row.verification?.name,
  },
  {
    name: 'dataRole',
    label: '用户角色',
    field: row => row.dataRole?.name,
  },
]

/**
 * 数据资源表格基础字段
 */
export const DATA_TABLE_COLUMNS: QTableColumn<IDataDirectory>[] = [
  {
    name: 'id',
    label: '资源ID',
    field: 'id',
  },
  {
    name: 'nameZH',
    label: '中文名',
    field: 'nameZH',
  },
  {
    name: 'nameEN',
    label: '英文名',
    field: 'nameEN',
  },
]

/**
 * 云桌面申请表格基础字段
 */
export const DESKTOP_REQUEST_TABLE_COLUMNS: QTableColumn<IDesktopQueue>[] = [
  {
    name: 'id',
    label: '用户',
    field: row => row.user?.account,
  },
  {
    name: 'email',
    label: '邮箱',
    field: row => row.user?.email,
  },
  {
    name: 'name',
    label: '姓名',
    field: row => row.user?.verification?.name,
  },
  {
    name: 'requestAt',
    label: '申请时间',
    field: row => moment(row.requestAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'duration',
    label: '申请时长',
    field: 'duration',
  },
  {
    name: 'attachments',
    label: '申请材料',
    field: 'attachments',
  },
  {
    name: 'userId',
    label: '用户信息详情',
    field: 'userId',
  },
  {
    name: 'status',
    label: '申请状态',
    field: 'status',
  },
]

/**
 * 云桌面表格基础字段
 */
export const DESKTOP_TABLE_COLUMNS: QTableColumn<IDesktop>[] = [
  {
    name: 'id',
    label: '云桌面ID',
    field: 'id',
  },
  {
    name: 'name',
    label: '云桌面名称',
    field: 'name',
  },
  {
    name: 'internalIp',
    label: 'IP地址',
    field: 'internalIp',
  },
  {
    name: 'accessUrl',
    label: '访问地址',
    field: 'accessUrl',
  },
  {
    name: 'account',
    label: '账号',
    field: 'account',
  },
  {
    name: 'password',
    label: '密码',
    field: 'password',
  },
  {
    name: 'createdAt',
    label: '创建时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'expiredAt',
    label: '到期时间',
    field: row => moment(row.expiredAt).format('YYYY-MM-DD'),
    sortable: true,
  },
  {
    name: 'userId',
    label: '用户',
    field: 'userId',
  },
]

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
    sortable: true,
  },
]
