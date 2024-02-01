/**
 * 更新数据目录
 * 请求参数
 */
export interface IUploadDirectoryQueryDto {
  /** 是否为动态层级 */
  dynamic?: boolean

  /** 清空后创建 */
  clear?: boolean
}
