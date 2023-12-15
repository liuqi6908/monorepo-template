import { MinioBucket } from '../enum/minio-bucket.enum'

export interface IBucketDto {
  /** Minio Bucket 桶名 */
  bucket: MinioBucket
}