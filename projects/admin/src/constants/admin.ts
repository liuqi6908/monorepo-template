import { PermissionType } from 'zjf-types'

interface PermissionItem {
  name: string
  value?: PermissionType[]
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
            value: [
              PermissionType.CMS_QUERY,
            ],
          },
          {
            name: '管理页面',
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
            value: [
              PermissionType.CONFIG_QUERY_APP,
            ],
          },
          {
            name: '管理全局配置',
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
            name: '查询用户列表',
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
            name: '查询认证列表',
            value: [
              PermissionType.VERIFICATION_LIST_ALL,
            ],
          },
          {
            name: '认证审核',
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
        ],
      },
      {
        name: '用户权限管理',
        children: [
          {
            name: '查询用户角色列表',
            value: [
              PermissionType.DATA_PERMISSION_QUERY,
            ],
          },
          {
            name: '创建用户角色',
            value: [
              PermissionType.DATA_PERMISSION_QUERY,
              PermissionType.DATA_PERMISSION_CREATE,
            ],
          },
          {
            name: '删除用户角色',
            value: [
              PermissionType.DATA_PERMISSION_QUERY,
              PermissionType.DATA_PERMISSION_DELETE,
            ],
          },
          {
            name: '修改角色权限和信息',
            value: [
              PermissionType.DATA_PERMISSION_QUERY,
              PermissionType.DATA_PERMISSION_UPDATE,
            ],
          },
          {
            name: '用户角色分配',
            value: [
              PermissionType.DATA_PERMISSION_QUERY,
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
              PermissionType.ACCOUNT_CREATE,
            ],
          },
          {
            name: '管理数据资源类型',
            value: [],
          },
        ],
      },
      {
        name: '设置数据资源结构',
        children: [
          {
            name: '只读访问数据资源结构',
            value: [],
          },
          {
            name: '管理数据资源结构',
            value: [],
          },
        ],
      },
      {
        name: '数据资源上传',
        children: [
          {
            name: '只读访问数据上传情况',
            value: [],
          },
          {
            name: '管理数据资源上传',
            value: [],
          },
        ],
      },
      {
        name: '设置数据资源介绍',
        children: [
          {
            name: '查看数据资源说明和引用规范',
            value: [],
          },
          {
            name: '管理数据资源说明和引用规范',
            value: [],
          },
        ],
      },
    ],
  },
  {
    name: '日志管理',
    to: '/log',
    permission: [],
  },
  {
    name: '用户权限管理',
    to: '/authority',
    permission: [],
  },

  {
    name: '桌面管理',
    to: '/desktop',
    permission: [],
  },
  {
    name: '管理员分配',
    to: '/admin',
    permission: [],
  },
  {
    name: '作品管理',
    to: '/work',
    permission: [],
  },
  {
    name: '申请采购',
    to: '/purchase',
    permission: [],
  },
  {
    name: '文件外发',
    to: '/export',
    permission: [],
  },
]
