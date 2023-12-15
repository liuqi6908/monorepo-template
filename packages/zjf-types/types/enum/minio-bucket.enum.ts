/**
 * Minio Bucket 桶名
 */
export enum MinioBucket {
  /** 数据目录 */
  DATA = 'data',
  /** 私有目录 */
  PRIVATE = 'pri',
  /** 公共目录 */
  PUBLIC = 'pub',
}

/**
 * Minio Bucket 桶名的描述
 */
export const minioBucketDescriptions: Record<MinioBucket, string> = {
  [MinioBucket.DATA]: '数据目录',
  [MinioBucket.PRIVATE]: '私有目录',
  [MinioBucket.PUBLIC]: '公共目录',
}