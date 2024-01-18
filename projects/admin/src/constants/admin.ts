import { PermissionType } from 'zjf-types'

export interface PermissionItem {
  name: string
  desc?: string
  value?: PermissionType[]
  base?: PermissionType | PermissionType[]
  children?: PermissionItem[]
}

interface AdminMenu {
  name: string
  to: string
  permission: PermissionItem[]
}

/**
 * 管理后台菜单列表
 */
export const ADMIN_MENU_LIST: AdminMenu[] = [
  {
    name: '页面管理',
    to: '/home',
    permission: [
      {
        name: '页面管理',
        children: [
          {
            name: '只读访问页面管理',
            desc: '只读访问页面配置功能',
            value: [
              PermissionType.CMS_QUERY,
            ],
          },
          {
            name: '管理页面',
            desc: '管理所有页面配置功能',
            value: [
              PermissionType.CMS_QUERY,
              PermissionType.CMS_CREATE,
              PermissionType.CMS_UPDATE,
              PermissionType.CMS_DELETE,
            ],
          },
        ],
      },
      {
        name: '全局配置',
        children: [
          {
            name: '只读访问全局配置页面',
            desc: '只读访问平台页面全局设置',
            value: [
              PermissionType.CONFIG_QUERY_APP,
            ],
          },
          {
            name: '管理全局配置',
            desc: '管理平台页面全局设置所有内容',
            value: [
              PermissionType.CONFIG_QUERY_APP,
              PermissionType.CONFIG_UPSERT_APP,
            ],
          },
        ],
      },
    ],
  },
  {
    name: '用户管理',
    to: '/user',
    permission: [
      {
        name: '用户信息管理',
        children: [
          {
            name: '只读访问用户列表',
            value: [
              PermissionType.ACCOUNT_QUERY,
            ],
          },
          {
            name: '创建用户信息',
            value: [
              PermissionType.ACCOUNT_QUERY,
              PermissionType.ACCOUNT_CREATE,
            ],
          },
          {
            name: '停用和启用用户账号',
            value: [
              PermissionType.ACCOUNT_QUERY,
              PermissionType.ACCOUNT_DELETE,
              PermissionType.ACCOUNT_UPDATE,
            ],
          },
        ],
      },
      {
        name: '用户认证管理',
        children: [
          {
            name: '只读访问认证列表',
            desc: '查看所有的用户认证申请',
            value: [
              PermissionType.VERIFICATION_LIST_ALL,
            ],
          },
          {
            name: '认证审核',
            desc: '通过或者驳回用户的认证申请',
            value: [
              PermissionType.VERIFICATION_LIST_ALL,
              PermissionType.VERIFICATION_CAT_ATTACHMENT,
              PermissionType.VERIFICATION_APPROVE,
              PermissionType.VERIFICATION_REJECT,
            ],
          },
          {
            name: '重置认证',
            value: [
              PermissionType.VERIFICATION_LIST_ALL,
              PermissionType.VERIFICATION_CAT_ATTACHMENT,
              PermissionType.VERIFICATION_CANCEL,
            ],
          },
          {
            name: '只读访问认证申请上传设置',
            value: [
              PermissionType.VERIFICATION_LIST_ALL,
              PermissionType.CONFIG_QUERY_VERIFICATION,
            ],
          },
          {
            name: '管理认证申请上传设置',
            desc: '管理用户认证时需要上传哪些材料',
            value: [
              PermissionType.VERIFICATION_LIST_ALL,
              PermissionType.CONFIG_QUERY_VERIFICATION,
              PermissionType.CONFIG_UPSERT_VERIFICATION,
            ],
          },
        ],
      },
      {
        name: '用户权限管理',
        base: [
          PermissionType.DATA_PERMISSION_QUERY,
          PermissionType.DATA_PERMISSION_ASSIGN_QUERY,
        ],
        children: [
          {
            name: '只读访问用户角色列表',
            value: [
              PermissionType.DATA_PERMISSION_QUERY,
            ],
          },
          {
            name: '管理用户角色',
            value: [
              PermissionType.DATA_PERMISSION_QUERY,
              PermissionType.DATA_PERMISSION_CREATE,
              PermissionType.DATA_PERMISSION_DELETE,
              PermissionType.DATA_PERMISSION_UPDATE,
            ],
          },
          {
            name: '只读访问用户角色分配情况',
            value: [
              PermissionType.DATA_PERMISSION_ASSIGN_QUERY,
            ],
          },
          {
            name: '管理用户角色分配',
            value: [
              PermissionType.DATA_PERMISSION_ASSIGN_QUERY,
              PermissionType.ACCOUNT_UPDATE_DATA_ROLE,
            ],
          },
        ],
      },
    ],
  },
  {
    name: '数据管理',
    to: '/data',
    permission: [
      {
        name: '创建数据资源类型',
        children: [
          {
            name: '只读访问数据资源类型',
            value: [
              PermissionType.DATA_ROOT_QUERY,
            ],
          },
          {
            name: '管理数据资源类型',
            value: [
              PermissionType.DATA_ROOT_QUERY,
              PermissionType.DATA_ROOT_CREATE,
              PermissionType.DATA_ROOT_UPDATE,
              PermissionType.DATA_ROOT_DELETE,
            ],
          },
        ],
      },
      {
        name: '设置数据资源结构',
        children: [
          {
            name: '只读访问数据资源结构',
            value: [
              PermissionType.DATA_QUERY,
            ],
          },
          {
            name: '管理数据资源结构',
            value: [
              PermissionType.DATA_QUERY,
              PermissionType.DATA_UPLOAD,
            ],
          },
        ],
      },
      {
        name: '数据资源上传',
        children: [
          {
            name: '只读访问数据上传情况',
            value: [
              PermissionType.DATA_UPLOAD_QUERY,
            ],
          },
          {
            name: '管理数据资源上传',
            value: [
              PermissionType.DATA_UPLOAD_QUERY,
              PermissionType.DATA_UPLOAD_TABLE,
            ],
          },
        ],
      },
      {
        name: '设置数据资源介绍',
        children: [
          {
            name: '只读访问数据库介绍和引用规范',
            value: [
              PermissionType.DATA_INTRO_QUERY,
            ],
          },
          {
            name: '管理数据库介绍和引用规范',
            value: [
              PermissionType.DATA_INTRO_QUERY,
              PermissionType.DATA_UPLOAD_INTRO,
              PermissionType.DATA_EDIT_REFERENCE,
            ],
          },
        ],
      },
    ],
  },
  {
    name: '云桌面管理',
    to: '/desktop',
    permission: [
      {
        name: '云桌面申请',
        children: [
          {
            name: '只读访问云桌面申请列表',
            desc: '查用户申请云桌面的信息列表',
            value: [
              PermissionType.DESKTOP_REQUEST_QUERY,
            ],
          },
          {
            name: '管理云桌面申请审核',
            desc: '通过或驳回云桌面的申请',
            value: [
              PermissionType.DESKTOP_REQUEST_QUERY,
              PermissionType.DESKTOP_REQUEST_CAT_ATTACHMENT,
              PermissionType.DESKTOP_REQUEST_APPROVE,
              PermissionType.DESKTOP_REQUEST_REJECT,
            ],
          },
          {
            name: '只读访问云桌面申请配置',
            value: [
              PermissionType.DESKTOP_REQUEST_QUERY,
              PermissionType.CONFIG_QUERY_DESKTOP_REQUEST,
            ],
          },
          {
            name: '管理云桌面申请配置',
            value: [
              PermissionType.DESKTOP_REQUEST_QUERY,
              PermissionType.CONFIG_QUERY_DESKTOP_REQUEST,
              PermissionType.CONFIG_UPSERT_DESKTOP_REQUEST,
            ],
          },
        ],
      },
      {
        name: '云桌面待分配',
        children: [
          {
            name: '只读访问待分配列表',
            desc: '查看待分配的信息列表',
            value: [
              PermissionType.DESKTOP_REQUEST_QUEUEING_QUERY,
            ],
          },
          {
            name: '手动创建待分配申请',
            value: [
              PermissionType.DESKTOP_REQUEST_QUEUEING_QUERY,
              PermissionType.DESKTOP_REQUEST_CREATE,
            ],
          },
          {
            name: '自动分配云桌面',
            desc: '从模板创建新的云桌面给用户使用',
            value: [
              PermissionType.DESKTOP_REQUEST_QUEUEING_QUERY,
              PermissionType.DESKTOP_CREATE_ASSIGN,
            ],
          },
          {
            name: '手动分配云桌面',
            desc: '手动从云桌面资源池中分配云桌面给用户',
            value: [
              PermissionType.DESKTOP_REQUEST_QUEUEING_QUERY,
              PermissionType.DESKTOP_QUERY,
              PermissionType.DESKTOP_ASSIGN,
            ],
          },
        ],
      },
      {
        name: '云桌面资源池',
        children: [
          {
            name: '只读访问云桌面资源池',
            value: [
              PermissionType.DESKTOP_QUERY,
            ],
          },
          {
            name: '管理云桌面资源池',
            value: [
              PermissionType.DESKTOP_QUERY,
              PermissionType.DESKTOP_CREATE,
              PermissionType.DESKTOP_UPDATE,
              PermissionType.DESKTOP_DISABLE,
              PermissionType.CONFIG_QUERY_DESKTOP,
              PermissionType.CONFIG_UPSERT_DESKTOP,
            ],
          },
        ],
      },
      {
        name: '云桌面停用',
        children: [
          {
            name: '只读访问停用列表',
            value: [
              PermissionType.DESKTOP_DISABLE_QUERY,
            ],
          },
          {
            name: '管理停用列表',
            value: [
              PermissionType.DESKTOP_DISABLE_QUERY,
              PermissionType.DESKTOP_DELETE,
            ],
          },
        ],
      },
      {
        name: '用户数据上传',
        children: [
          {
            name: '只读访问用户数据上传列表',
            value: [
              PermissionType.DESKTOP_FTP_QUERY,
              PermissionType.CONFIG_QUERY_DESKTOP_FTP,
            ],
          },
          {
            name: '管理用户数据上传设置',
            value: [
              PermissionType.DESKTOP_FTP_QUERY,
              PermissionType.DESKTOP_FTP_DELETE,
              PermissionType.CONFIG_QUERY_DESKTOP_FTP,
              PermissionType.CONFIG_UPSERT_DESKTOP_FTP,
            ],
          },
        ],
      },
    ],
  },
  {
    name: '日志管理',
    to: '/log',
    permission: [
      {
        name: '只读访问日志',
        desc: '只读查看日志页面',
        value: [
          PermissionType.LOG_VIEW,
        ],
      },
      {
        name: '管理日志',
        desc: '使用所有日志管理功能',
        value: [
          PermissionType.LOG_VIEW,
          PermissionType.LOG_MANAGE,
        ],
      },
    ],
  },
  {
    name: '作品管理',
    to: '/work',
    permission: [
      {
        name: '只读访问作品',
        value: [
          PermissionType.WORK_QUERY_ALL,
        ],
      },
      {
        name: '管理作品',
        value: [
          PermissionType.WORK_QUERY_ALL,
          PermissionType.WORK_DOWNLOAD,
        ],
      },
      {
        name: '只读访问上传作品配置',
        value: [
          PermissionType.WORK_QUERY_ALL,
          PermissionType.CONFIG_QUERY_WORK,
        ],
      },
      {
        name: '管理上传作品配置',
        value: [
          PermissionType.WORK_QUERY_ALL,
          PermissionType.CONFIG_QUERY_WORK,
          PermissionType.CONFIG_UPSERT_WORK,
        ],
      },
    ],
  },
  {
    name: '采购管理',
    to: '/purchase',
    permission: [
      {
        name: '只读访问采购',
        value: [
          PermissionType.DATA_SUGGEST_QUERY_ALL,
        ],
      },
      {
        name: '管理采购',
        value: [
          PermissionType.DATA_SUGGEST_QUERY_ALL,
        ],
      },
    ],
  },
  {
    name: '外发管理',
    to: '/export',
    permission: [
      {
        name: '大文件外发待审核',
        children: [
          {
            name: '只读访问待审核列表',
            value: [
              PermissionType.EXPORT_LG_QUERY_PENDING,
            ],
          },
          {
            name: '管理待审核列表',
            value: [
              PermissionType.EXPORT_LG_QUERY_PENDING,
              PermissionType.EXPORT_LG_DOWNLOAD,
              PermissionType.EXPORT_LG_APPROVE,
              PermissionType.EXPORT_LG_REJECT,
            ],
          },
        ],
      },
      {
        name: '大文件外发审核记录',
        children: [
          {
            name: '只读访问审核记录',
            value: [
              PermissionType.EXPORT_LG_QUERY_ALL,
            ],
          },
          {
            name: '管理审核记录',
            value: [
              PermissionType.EXPORT_LG_QUERY_ALL,
              PermissionType.EXPORT_LG_DOWNLOAD,
            ],
          },
        ],
      },
      {
        name: '小文件自动外发记录',
        children: [
          {
            name: '只读访问外发记录',
            value: [
              PermissionType.EXPORT_SM_QUERY_ALL,
            ],
          },
          {
            name: '管理外发记录',
            value: [
              PermissionType.EXPORT_SM_QUERY_ALL,
              PermissionType.EXPORT_SM_DOWNLOAD,
            ],
          },
        ],
      },
      {
        name: '外发设置',
        children: [
          {
            name: '只读访问外发设置',
            value: [
              PermissionType.CONFIG_QUERY_EXPORT,
            ],
          },
          {
            name: '管理外发设置',
            value: [
              PermissionType.CONFIG_QUERY_EXPORT,
              PermissionType.CONFIG_UPSERT_EXPORT,
            ],
          },
        ],
      },
    ],
  },
  {
    name: '管理员配置',
    to: '/admin',
    permission: [
      {
        name: '设置管理角色',
        children: [
          {
            name: '只读访问管理角色',
            value: [
              PermissionType.ROLE_QUERY,
            ],
          },
          {
            name: '设置管理角色',
            value: [
              PermissionType.ROLE_QUERY,
              PermissionType.ROLE_CREATE,
              PermissionType.ROLE_UPDATE,
              PermissionType.ROLE_DELETE,
            ],
          },
        ],
      },
      {
        name: '分配管理角色',
        children: [
          {
            name: '只读访问用户管理',
            value: [
              PermissionType.ROLE_ASSIGN_QUERY,
            ],
          },
          {
            name: '分配管理角色',
            value: [
              PermissionType.ROLE_ASSIGN_QUERY,
              PermissionType.ACCOUNT_UPDATE_ROLE,
            ],
          },
        ],
      },
    ],
  },
]