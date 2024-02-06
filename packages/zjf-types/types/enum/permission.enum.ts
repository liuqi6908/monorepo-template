/**
 * 粒子化权限类型
 */
export enum PermissionType {

  // ---------------- 超级管理员 -------------------
  // /**
  //  * 管理后台全部功能的管理权限
  //  * @deprecated 只能使用最细粒度的权限
  //  **/

  // ------------------- 账户 ---------------------
  /** 创建账户 */
  ACCOUNT_CREATE = 'account:create',
  /** 删除账户 */
  ACCOUNT_DELETE = 'account:delete',
  /** 更新账户的信息 */
  ACCOUNT_UPDATE = 'account:update',
  /** 删除账户密码 */
  ACCOUNT_DELETE_PASSWORD = 'account:delete-password',
  /** 查询账户（条件查找用户列表，获取用户信息） */
  ACCOUNT_QUERY = 'account:query',
  /** 更新指定用户的角色 */
  ACCOUNT_UPDATE_ROLE = 'account:update-role',
  /** 更新指定用户的数据角色 */
  ACCOUNT_UPDATE_DATA_ROLE = 'account:update-data-role',

  // ------------------ 身份验证 ---------------------
  /** 查看所有的身份验证申请 */
  VERIFICATION_LIST_ALL = 'verification:list-all',
  /** 查看上传的附件 */
  VERIFICATION_CAT_ATTACHMENT = 'verification:cat-attachment',
  /** 通过身份验证 */
  VERIFICATION_APPROVE = 'verification:approve',
  /** 驳回身份验证 */
  VERIFICATION_REJECT = 'verification:reject',
  /** 取消一个用户的认证 */
  VERIFICATION_CANCEL = 'verification:cancel',

  // ------------------ 内容管理 ---------------------
  /** 查询内容 */
  CMS_QUERY = 'cms:query',
  /** 创建内容 */
  CMS_CREATE = 'cms:create',
  /** 更新内容 */
  CMS_UPDATE = 'cms:update',
  /** 删除内容 */
  CMS_DELETE = 'cms:delete',

  // ------------------ 数据管理-资源 ---------------------
  /** 查询数据大类 */
  DATA_ROOT_QUERY = 'data-root:query',
  /** 创建数据大类 */
  DATA_ROOT_CREATE = 'data-root:create',
  /** 更新数据大类 */
  DATA_ROOT_UPDATE = 'data-root:update',
  /** 删除数据大类 */
  DATA_ROOT_DELETE = 'data-root:delete',
  /** 查询数据资源结构 */
  DATA_QUERY = 'data:query',
  /** 上传中间表 */
  DATA_UPLOAD = 'data:upload',
  /** 查询数据资源上传情况 */
  DATA_UPLOAD_QUERY = 'data-upload:query',
  /** 上传表格样例/下载文件 */
  DATA_UPLOAD_TABLE = 'data-upload:table',
  /** 查询数据资源介绍 */
  DATA_INTRO_QUERY = 'data-intro:query',
  /** 上传数据资源介绍 */
  DATA_UPLOAD_INTRO = 'data-intro:upload',
  /** 编辑数据引用规范 */
  DATA_EDIT_REFERENCE = 'data-intro:reference',

  // ------------------ 数据管理-权限 ---------------------
  /** 创建数据角色 */
  DATA_PERMISSION_CREATE = 'data-permission:create',
  /** 更新数据角色 */
  DATA_PERMISSION_UPDATE = 'data-permission:update',
  /** 删除数据角色 */
  DATA_PERMISSION_DELETE = 'data-permission:delete',
  /** 查询数据角色 */
  DATA_PERMISSION_QUERY = 'data-permission:query',
  /** 查询数据角色分配列表 */
  DATA_PERMISSION_ASSIGN_QUERY = 'data-permission:assign-query',

  // ------------------ 日志访问 ---------------------
  /** 查看日志 */
  LOG_VIEW = 'log:view',
  /** 管理日志 */
  LOG_MANAGE = 'log:manage',

  // ------------------ 云桌面-申请 ---------------------
  /** 查看云桌面申请附件 */
  DESKTOP_REQUEST_CAT_ATTACHMENT = 'desktop-request:cat-attachment',
  /** 创建云桌面申请 */
  DESKTOP_REQUEST_CREATE = 'desktop-request:create',
  /** 通过云桌面申请 */
  DESKTOP_REQUEST_APPROVE = 'desktop-request:approve',
  /** 驳回云桌面申请 */
  DESKTOP_REQUEST_REJECT = 'desktop-request:reject',
  /** 查询云桌面申请 */
  DESKTOP_REQUEST_QUERY = 'desktop-request:query',
  /** 查询排队中云桌面申请 */
  DESKTOP_REQUEST_QUEUEING_QUERY = 'desktop-request:queueing-query',

  // ------------------ 云桌面-管理 ---------------------
  /** 创建云桌面 */
  DESKTOP_CREATE = 'desktop:create',
  /** 停用云桌面 */
  DESKTOP_DISABLE = 'desktop:disable',
  /** 更新云桌面 */
  DESKTOP_UPDATE = 'desktop:update',
  /** 删除云桌面 */
  DESKTOP_DELETE = 'desktop:delete',
  /** 自动创建云桌面并分配给指定用户 */
  DESKTOP_CREATE_ASSIGN = 'desktop:create-assign',
  /** 分配云桌面给指定用户 */
  DESKTOP_ASSIGN = 'desktop:assign',
  /** 查询云桌面 */
  DESKTOP_QUERY = 'desktop:query',
  /** 云桌面开关机 */
  DESKTOP_ON_OFF = 'desktop:on-off',
  /** 查询待分配云桌面 */
  DESKTOP_QUERY_ASSIGN = 'desktop:query-assign',
  /** 查询已停用云桌面 */
  DESKTOP_DISABLE_QUERY = 'desktop:disable-query',
  /** 查询数据上传云桌面 */
  DESKTOP_FTP_QUERY = 'desktop:ftp-query',
  /** 删除云桌面数据 */
  DESKTOP_FTP_DELETE = 'desktop:ftp-delete',
  /** 云桌面过期检查 */
  DESKTOP_EXPIRE_CHECK = 'desktop:expire-check',

  // ------------------ 角色权限 ---------------------
  /** 创建角色权限 */
  ROLE_CREATE = 'role:create',
  /** 更新角色权限 */
  ROLE_UPDATE = 'role:update',
  /** 删除角色权限 */
  ROLE_DELETE = 'role:delete',
  /** 查询角色权限 */
  ROLE_QUERY = 'role:query',
  /** 查询角色权限分配列表 */
  ROLE_ASSIGN_QUERY = 'role:assign-query',

  // ------------------ 数据外发 ---------------------
  /** 查询所有大文件外发历史 */
  EXPORT_LG_QUERY_ALL = 'export-lg:query-all',
  /** 查询待审核大文件外发历史 */
  EXPORT_LG_QUERY_PENDING = 'export-lg:query-pending',
  /** 查询所有小文件外发历史 */
  EXPORT_SM_QUERY_ALL = 'export-sm:query-all',
  /** 下载小文件外发的文件 */
  EXPORT_SM_DOWNLOAD = 'export-sm:download',
  /** 通过大文件外发申请 */
  EXPORT_LG_APPROVE = 'export-lg:approve',
  /** 驳回大文件外发申请 */
  EXPORT_LG_REJECT = 'export-lg:reject',
  /** 下载大文件外发的文件（待审核） */
  EXPORT_LG_DOWNLOAD_PENDING = 'export-lg:download-pending',
  /** 下载大文件外发的文件（审核记录） */
  EXPORT_LG_DOWNLOAD_RECORD = 'export-lg:download-record',

  // ------------------ 全局配置 ---------------------
  /** 查询应用全局配置 */
  CONFIG_QUERY_APP = 'config:query-app',
  /** 创建/更新应用全局配置 */
  CONFIG_UPSERT_APP = 'config:upsert-app',
  /** 查询云桌面申请配置 */
  CONFIG_QUERY_DESKTOP_REQUEST = 'config:query-desktop-request',
  /** 创建/更新云桌面申请配置 */
  CONFIG_UPSERT_DESKTOP_REQUEST = 'config:upsert-desktop-request',
  /** 查询云桌面配置 */
  CONFIG_QUERY_DESKTOP = 'config:query-desktop',
  /** 创建/更新云桌面配置 */
  CONFIG_UPSERT_DESKTOP = 'config:upsert-desktop',
  /** 查询云桌面文件传输配置 */
  CONFIG_QUERY_DESKTOP_FTP = 'config:query-desktop-fto',
  /** 创建/更新云桌面文件传输配置 */
  CONFIG_UPSERT_DESKTOP_FTP = 'config:upsert-desktop-ftp',
  /** 查询文件外发配置 */
  CONFIG_QUERY_EXPORT = 'config:query-export',
  /** 创建/更新文件外发配置 */
  CONFIG_UPSERT_EXPORT = 'config:upsert-export',
  /** 查询身份认证上传配置 */
  CONFIG_QUERY_VERIFICATION = 'config:query-verification',
  /** 创建/更新身份认证上传配置 */
  CONFIG_UPSERT_VERIFICATION = 'config:upsert-verification',
  /** 查询作品管理配置 */
  CONFIG_QUERY_WORK = 'config:query-work',
  /** 创建/更新作品管理配置 */
  CONFIG_UPSERT_WORK = 'config:upsert-work',
  /** 查询数据采购配置 */
  CONFIG_QUERY_PURCHASE = 'config:query-purchase',
  /** 创建/更新数据采购配置 */
  CONFIG_UPSERT_PURCHASE = 'config:upsert-purchase',

  // ------------------ 作品/成果 ---------------------
  /** 查询所有作品/成果 */
  WORK_QUERY_ALL = 'work:query-all',
  /** 下载指定作品/成果的附件 */
  WORK_DOWNLOAD = 'work:download',

  // ------------------ 采购建议 ----–––---------------
  /** 查询所有的采购建议 */
  DATA_SUGGEST_QUERY_ALL = 'data-suggest:query-all',
  /** 下载所有的采购建议 */
  DATA_SUGGEST_DOWNLOAD = 'data-suggest:download',
}

/**
 * 粒子化权限类型的描述
 */
export const permissionDescriptions: Record<PermissionType, string> = {
  [PermissionType.ACCOUNT_CREATE]: '创建账号',
  [PermissionType.ACCOUNT_DELETE]: '删除账号',
  [PermissionType.ACCOUNT_UPDATE]: '更新账号信息',
  [PermissionType.ACCOUNT_DELETE_PASSWORD]: '删除账户密码',
  [PermissionType.ACCOUNT_QUERY]: '查询账户（条件查找用户列表，获取用户信息）',
  [PermissionType.ACCOUNT_UPDATE_ROLE]: '更新指定用户的角色',
  [PermissionType.ACCOUNT_UPDATE_DATA_ROLE]: '更新指定用户的数据角色',

  [PermissionType.VERIFICATION_LIST_ALL]: '查看所有的身份验证申请',
  [PermissionType.VERIFICATION_CAT_ATTACHMENT]: '查看上传的附件',
  [PermissionType.VERIFICATION_APPROVE]: '通过身份验证申请',
  [PermissionType.VERIFICATION_REJECT]: '驳回身份验证申请',
  [PermissionType.VERIFICATION_CANCEL]: '取消一个用户的认证',

  [PermissionType.CMS_QUERY]: '查询内容',
  [PermissionType.CMS_CREATE]: '创建内容',
  [PermissionType.CMS_UPDATE]: '更新内容',
  [PermissionType.CMS_DELETE]: '删除内容',

  [PermissionType.DATA_ROOT_QUERY]: '查询数据大类',
  [PermissionType.DATA_ROOT_CREATE]: '创建数据大类',
  [PermissionType.DATA_ROOT_UPDATE]: '更新数据大类',
  [PermissionType.DATA_ROOT_DELETE]: '删除数据大类',
  [PermissionType.DATA_QUERY]: '查询数据资源结构',
  [PermissionType.DATA_UPLOAD]: '上传中间表',
  [PermissionType.DATA_UPLOAD_QUERY]: '查询数据资源上传情况',
  [PermissionType.DATA_UPLOAD_TABLE]: '上传表格样例/下载文件',
  [PermissionType.DATA_INTRO_QUERY]: '查询数据资源介绍',
  [PermissionType.DATA_UPLOAD_INTRO]: '上传数据资源介绍',
  [PermissionType.DATA_EDIT_REFERENCE]: '编辑数据引用规范',

  [PermissionType.DATA_PERMISSION_CREATE]: '创建数据角色',
  [PermissionType.DATA_PERMISSION_UPDATE]: '更新数据角色',
  [PermissionType.DATA_PERMISSION_DELETE]: '删除数据角色',
  [PermissionType.DATA_PERMISSION_QUERY]: '查询数据角色',
  [PermissionType.DATA_PERMISSION_ASSIGN_QUERY]: '查询数据角色分配列表',

  [PermissionType.LOG_VIEW]: '查看日志',
  [PermissionType.LOG_MANAGE]: '管理日志',

  [PermissionType.DESKTOP_REQUEST_CAT_ATTACHMENT]: '查看云桌面申请附件',
  [PermissionType.DESKTOP_REQUEST_CREATE]: '创建云桌面申请',
  [PermissionType.DESKTOP_REQUEST_APPROVE]: '通过云桌面申请',
  [PermissionType.DESKTOP_REQUEST_REJECT]: '驳回云桌面申请',
  [PermissionType.DESKTOP_REQUEST_QUERY]: '查询云桌面申请',
  [PermissionType.DESKTOP_QUERY_ASSIGN]: '查询待分配云桌面',
  [PermissionType.DESKTOP_REQUEST_QUEUEING_QUERY]: '查询排队中云桌面申请',

  [PermissionType.DESKTOP_CREATE]: '创建云桌面',
  [PermissionType.DESKTOP_DISABLE]: '停用云桌面',
  [PermissionType.DESKTOP_UPDATE]: '更新云桌面',
  [PermissionType.DESKTOP_DELETE]: '删除云桌面',
  [PermissionType.DESKTOP_CREATE_ASSIGN]: '自动创建云桌面并分配给指定用户',
  [PermissionType.DESKTOP_ASSIGN]: '分配云桌面给指定用户',
  [PermissionType.DESKTOP_QUERY]: '查询云桌面',
  [PermissionType.DESKTOP_ON_OFF]: '云桌面开关机',
  [PermissionType.DESKTOP_DISABLE_QUERY]: '查询已停用云桌面',
  [PermissionType.DESKTOP_FTP_QUERY]: '查询数据上传云桌面',
  [PermissionType.DESKTOP_FTP_DELETE]: '删除云桌面数据',
  [PermissionType.DESKTOP_EXPIRE_CHECK]: '云桌面过期检查',

  [PermissionType.ROLE_CREATE]: '创建角色权限',
  [PermissionType.ROLE_UPDATE]: '更新角色权限',
  [PermissionType.ROLE_DELETE]: '删除角色权限',
  [PermissionType.ROLE_QUERY]: '查询角色权限',
  [PermissionType.ROLE_ASSIGN_QUERY]: '查询角色权限分配列表',

  [PermissionType.EXPORT_LG_QUERY_ALL]: '查询所有大文件外发历史',
  [PermissionType.EXPORT_LG_QUERY_PENDING]: '查询待审核大文件外发历史',
  [PermissionType.EXPORT_SM_QUERY_ALL]: '查询所有小文件外发历史',
  [PermissionType.EXPORT_SM_DOWNLOAD]: '下载小文件外发的文件',
  [PermissionType.EXPORT_LG_APPROVE]: '通过大文件外发申请',
  [PermissionType.EXPORT_LG_REJECT]: '驳回大文件外发申请',
  [PermissionType.EXPORT_LG_DOWNLOAD_PENDING]: '下载大文件外发的文件（待审核）',
  [PermissionType.EXPORT_LG_DOWNLOAD_RECORD]: '下载大文件外发的文件（审核记录）',

  [PermissionType.CONFIG_QUERY_APP]: '查询应用全局配置',
  [PermissionType.CONFIG_UPSERT_APP]: '创建/更新应用全局配置',
  [PermissionType.CONFIG_QUERY_DESKTOP_REQUEST]: '查询云桌面申请配置',
  [PermissionType.CONFIG_UPSERT_DESKTOP_REQUEST]: '创建/更新云桌面申请配置',
  [PermissionType.CONFIG_QUERY_DESKTOP]: '查询云桌面配置',
  [PermissionType.CONFIG_UPSERT_DESKTOP]: '创建/更新云桌面配置',
  [PermissionType.CONFIG_QUERY_DESKTOP_FTP]: '查询云桌面文件传输配置',
  [PermissionType.CONFIG_UPSERT_DESKTOP_FTP]: '创建/更新云桌面文件传输配置',
  [PermissionType.CONFIG_QUERY_EXPORT]: '查询文件外发全局配置',
  [PermissionType.CONFIG_UPSERT_EXPORT]: '创建/更新文件外发全局配置',
  [PermissionType.CONFIG_QUERY_VERIFICATION]: '查询身份认证上传全局配置',
  [PermissionType.CONFIG_UPSERT_VERIFICATION]: '创建/更新身份认证上传全局配置',
  [PermissionType.CONFIG_QUERY_WORK]: '查询作品管理全局配置',
  [PermissionType.CONFIG_UPSERT_WORK]: '创建/更新作品管理全局配置',
  [PermissionType.CONFIG_QUERY_PURCHASE]: '查询数据采购配置',
  [PermissionType.CONFIG_UPSERT_PURCHASE]: '创建/更新数据采购配置',

  [PermissionType.WORK_QUERY_ALL]: '查询所有作品/成果',
  [PermissionType.WORK_DOWNLOAD]: '下载指定作品/成果的附件',

  [PermissionType.DATA_SUGGEST_QUERY_ALL]: '查询所有的采购建议',
  [PermissionType.DATA_SUGGEST_DOWNLOAD]: '下载所有的采购建议',
}
