/**
 * 上传数据类型
 */
export enum UploadType {
  /** 预览 */
  PREVIEW = 'preview',
  /** 下载 */
  DOWNLOAD = 'download',
}

/**
 * 上传数据类型的描述
 */
export const uploadTypeDescriptions: Record<UploadType, string> = {
  [UploadType.PREVIEW]: '预览',
  [UploadType.DOWNLOAD]: '下载',
}
