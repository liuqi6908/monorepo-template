import { PermissionType } from 'zjf-types'

interface AdminMenu {
  name: string
  to: string
  permission: PermissionType[]
}

/**
 * 管理后台菜单列表
 */
export const ADMIN_MENU_LIST: AdminMenu[] = [
  {
    name: '页面管理',
    to: '/home',
    permission: [
      PermissionType.CMS_CREATE,
      PermissionType.CMS_UPDATE,
      PermissionType.CMS_DELETE,
      PermissionType.CONFIG_UPSERT_APP,
    ],
  },
  {
    name: '用户管理',
    to: '/user',
    permission: [
      PermissionType.ACCOUNT_CREATE,
      PermissionType.ACCOUNT_DELETE,
      PermissionType.ACCOUNT_UPDATE,
      PermissionType.ACCOUNT_QUERY,
      PermissionType.VERIFICATION_LIST_ALL,
      PermissionType.VERIFICATION_CAT_ATTACHMENT,
      PermissionType.VERIFICATION_APPROVE,
      PermissionType.VERIFICATION_REJECT,
      PermissionType.VERIFICATION_CANCEL,
    ],
  },
  {
    name: '数据管理',
    to: '/data',
    permission: [
      PermissionType.DATA_UPLOAD,
      PermissionType.DATA_UPLOAD_INTRO,
      PermissionType.DATA_UPLOAD_TABLE,
      PermissionType.DATA_EDIT_REFERENCE,
      PermissionType.DATA_QUERY_ALL,
      PermissionType.DATA_ROOT_CREATE,
      PermissionType.DATA_ROOT_UPDATE,
      PermissionType.DATA_ROOT_DELETE,
    ],
  },
  {
    name: '日志管理',
    to: '/log',
    permission: [
      PermissionType.LOG_VIEW,
    ],
  },
  {
    name: '用户权限管理',
    to: '/authority',
    permission: [
      PermissionType.ACCOUNT_UPDATE_DATA_ROLE,
      PermissionType.DATA_PERMISSION_CREATE,
      PermissionType.DATA_PERMISSION_UPDATE,
      PermissionType.DATA_PERMISSION_DELETE,
      PermissionType.DATA_PERMISSION_QUERY,
    ],
  },

  {
    name: '桌面管理',
    to: '/desktop',
    permission: [
      PermissionType.DESKTOP_REQUEST_CAT_ATTACHMENT,
      PermissionType.DESKTOP_REQUEST_CREATE,
      PermissionType.DESKTOP_REQUEST_APPROVE,
      PermissionType.DESKTOP_REQUEST_REJECT,
      PermissionType.DESKTOP_REQUEST_QUERY,
      PermissionType.DESKTOP_CREATE,
      PermissionType.DESKTOP_DISABLE,
      PermissionType.DESKTOP_UPDATE,
      PermissionType.DESKTOP_DELETE,
      PermissionType.DESKTOP_ASSIGN,
      PermissionType.DESKTOP_QUERY,
      PermissionType.DESKTOP_EXPIRE_CHECK,
      PermissionType.CONFIG_UPSERT_DESKTOP,
    ],
  },
  {
    name: '管理员分配',
    to: '/admin',
    permission: [
      PermissionType.ACCOUNT_UPDATE_ROLE,
      PermissionType.ROLE_CREATE,
      PermissionType.ROLE_UPDATE,
      PermissionType.ROLE_DELETE,
      PermissionType.ROLE_QUERY,
    ],
  },
  {
    name: '作品管理',
    to: '/work',
    permission: [
      PermissionType.WORK_QUERY_ALL,
      PermissionType.WORK_DOWNLOAD,
      PermissionType.CONFIG_UPSERT_WORK,
    ],
  },
  {
    name: '申请采购',
    to: '/purchase',
    permission: [
      PermissionType.DATA_SUGGEST_QUERY_ALL,
    ],
  },
  {
    name: '文件外发',
    to: '/export',
    permission: [
      PermissionType.EXPORT_LG_QUERY_ALL,
      PermissionType.EXPORT_SM_QUERY_ALL,
      PermissionType.EXPORT_SM_DOWNLOAD,
      PermissionType.EXPORT_LG_APPROVE,
      PermissionType.EXPORT_LG_REJECT,
      PermissionType.EXPORT_LG_DOWNLOAD,
      PermissionType.CONFIG_UPSERT_EXPORT,
    ],
  },
]
