import { PermissionType } from 'zjf-types'
import { hasIntersection, omit } from 'zjf-utils'

interface MenuItem {
  id: string
  label: string
  flag?: boolean
}

const { adminRole } = useUser()

/** 当前激活菜单 */
const active = ref<string>()

export function useMenu() {
  const $route = useRoute()

  /** 菜单 */
  const menu = computed<MenuItem[] | undefined>(() => {
    const role = adminRole.value
    const menu: Record<string, MenuItem[]> = {
      home: [
        ...CMS_CONFIG.map(v => ({
          ...omit(v, 'component'),
          flag: role?.includes(PermissionType.CMS_QUERY)
            && (v.id !== 'homeExpand' || getEnvVariable('VITE_HOME_EXPAND', false)),
        })),
        {
          id: 'globalConfig',
          label: '全局配置',
          flag: role?.includes(PermissionType.CONFIG_QUERY_APP),
        },
      ],
      user: [
        {
          id: 'userInfo',
          label: '用户信息管理',
          flag: role?.includes(PermissionType.ACCOUNT_QUERY),
        },
        {
          id: 'userVerification',
          label: '用户认证管理',
          flag: hasIntersection(
            role ?? [],
            [
              PermissionType.VERIFICATION_LIST_ALL,
              PermissionType.CONFIG_QUERY_VERIFICATION,
            ],
          ),
        },
        {
          id: 'userRole',
          label: '用户权限管理',
          flag: hasIntersection(
            role ?? [],
            [
              PermissionType.DATA_PERMISSION_QUERY,
              PermissionType.DATA_PERMISSION_ASSIGN_QUERY,
            ],
          ),
        },
      ],
      data: [
        {
          id: 'dataType',
          label: '数据资源类型',
          flag: role?.includes(PermissionType.DATA_ROOT_QUERY),
        },
        {
          id: 'dataStructure',
          label: '数据资源结构',
          flag: role?.includes(PermissionType.DATA_QUERY),
        },
        {
          id: 'dataUpload',
          label: '数据资源上传',
          flag: role?.includes(PermissionType.DATA_UPLOAD_QUERY),
        },
        {
          id: 'dataIntroduce',
          label: '数据资源介绍',
          flag: role?.includes(PermissionType.DATA_INTRO_QUERY),
        },
      ],
      desktop: [
        {
          id: 'desktopRequest',
          label: '云桌面申请',
          flag: hasIntersection(
            role ?? [],
            [
              PermissionType.DESKTOP_REQUEST_QUERY,
              PermissionType.CONFIG_QUERY_DESKTOP_REQUEST,
            ],
          ),
        },
        {
          id: 'desktopQueueing',
          label: '待分配列表',
          flag: role?.includes(PermissionType.DESKTOP_REQUEST_QUEUEING_QUERY),
        },
        {
          id: 'desktopList',
          label: '云桌面资源池',
          flag: role?.includes(PermissionType.DESKTOP_QUERY),
        },
        {
          id: 'desktopRecycled',
          label: '云桌面回收站',
          flag: role?.includes(PermissionType.DESKTOP_DISABLE_QUERY),
        },
        {
          id: 'desktopData',
          label: '用户数据上传',
          flag: role?.includes(PermissionType.DESKTOP_FTP_QUERY) && getEnvVariable('VITE_DESKTOP_FTP'),
        },
      ],
      log: [
        {
          id: 'logView',
          label: '日志管理',
          flag: role?.includes(PermissionType.LOG_VIEW),
        },
      ],
      work: [
        {
          id: 'workView',
          label: '作品管理',
          flag: role?.includes(PermissionType.WORK_QUERY_ALL),
        },
        {
          id: 'workConfig',
          label: '上传作品配置管理',
          flag: role?.includes(PermissionType.CONFIG_QUERY_WORK),
        },
      ],
      purchase: [
        {
          id: 'purchaseView',
          label: '采购管理',
          flag: role?.includes(PermissionType.DATA_SUGGEST_QUERY_ALL),
        },
      ],
      export: [
        {
          id: 'exportAudit',
          label: '大文件外发待审核',
          flag: role?.includes(PermissionType.EXPORT_LG_QUERY_PENDING),
        },
        {
          id: 'exportLargeRecord',
          label: '大文件外发审核记录',
          flag: role?.includes(PermissionType.EXPORT_LG_QUERY_ALL),
        },
        {
          id: 'exportSmallRecord',
          label: '小文件自动外发记录',
          flag: role?.includes(PermissionType.EXPORT_SM_QUERY_ALL),
        },
        {
          id: 'exportConfig',
          label: '外发配置管理',
          flag: role?.includes(PermissionType.CONFIG_QUERY_EXPORT),
        },
      ],
      admin: [
        {
          id: 'adminRole',
          label: '设置管理权限',
          flag: role?.includes(PermissionType.ROLE_QUERY),
        },
        {
          id: 'adminAssign',
          label: '分配管理权限',
          flag: role?.includes(PermissionType.ROLE_ASSIGN_QUERY),
        },
      ],
    }
    return menu[$route.path.substring(1)]
  })

  return {
    active,
    menu,
  }
}
