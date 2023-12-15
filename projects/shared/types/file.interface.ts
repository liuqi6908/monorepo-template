/**
 * Minio 文件信息
 */
export interface FileItem {
  /** 文件路径 + 文件名 */
  name: string
  /** 最后修改时间 */
  lastModified: string
  /** 标识 */
  etag: string
  /** 大小 */
  size: number
}