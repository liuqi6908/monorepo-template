/**
 * 日志数据行为
 */
export enum LogDataAction {
  /** 预览数据 */
  PREVIEW = 'data:preview',
  /** 下载数据 */
  DOWNLOAD = 'data:download',
}

/**
 * 日志数据行为的描述
 */
export const logDataActionDescriptions: Record<LogDataAction, string> = {
  [LogDataAction.PREVIEW]: '预览数据',
  [LogDataAction.DOWNLOAD]: '下载数据',
}

/**
 * 日志操作对象
 */
export enum LogTarget {
  /** 数据 */
  DATA = 'data',
}

/**
 * 日志操作对象的描述
 */
export const logTargetDescriptions: Record<LogTarget, string> = {
  [LogTarget.DATA]: '数据',
}

/**
 * 日志聚合纬度
 */
export enum LogDimensionId {
  /** 按年统计 */
  D_YEAR = 'D_YEAR',
  /** 按季度统计 */
  D_QUARTER = 'D_QUARTER',
  /** 按月统计 */
  D_MONTH = 'D_MONTH',
  /** 按日统计 */
  D_DAY = 'D_DAY',
  /** 按小时统计 */
  D_HOUR = 'D_HOUR',
  /** 按分钟统计 */
  D_MINUTE = 'D_MINUTE',
  /** 按操作统计 */
  D_ACTION = 'D_ACTION',
  /** 按用户统计 */
  D_USER = 'D_USER',
  /** 按 IP 统计 */
  D_IP = 'D_IP',
  /** 按数据大类统计 */
  D_ROOT = 'D_ROOT',
  /** 按数据库统计 */
  D_DB = 'D_DB',
  /** 按数据子库统计 */
  D_SUB_DB = 'D_SUB_DB',
  /** 按模块统计 */
  D_MODULE = 'D_MODULE',
  /** 按表统计 */
  D_TABLE = 'D_TABLE',
}

/**
 * 日志聚合纬度的描述
 */
export const logDimensionIdDescriptions: Record<LogDimensionId, string> = {
  [LogDimensionId.D_YEAR]: '按年统计',
  [LogDimensionId.D_QUARTER]: '按季度统计',
  [LogDimensionId.D_MONTH]: '按月统计',
  [LogDimensionId.D_DAY]: '按日统计',
  [LogDimensionId.D_HOUR]: '按小时统计',
  [LogDimensionId.D_MINUTE]: '按分钟统计',
  [LogDimensionId.D_ACTION]: '按操作统计',
  [LogDimensionId.D_USER]: '按用户统计',
  [LogDimensionId.D_IP]: '按 IP 统计',
  [LogDimensionId.D_ROOT]: '按数据大类统计',
  [LogDimensionId.D_DB]: '按数据库统计',
  [LogDimensionId.D_SUB_DB]: '按数据子库统计',
  [LogDimensionId.D_MODULE]: '按模块统计',
  [LogDimensionId.D_TABLE]: '按表统计',
}
