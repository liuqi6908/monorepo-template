import { Bufferfrom, createClient } from 'minio-vite-js'
import type { MinioBucket } from 'zjf-types'

import { getEnvVariable } from '../utils/env'
import { useUser } from './user'

/** Minio Bucket */
const minioConfig: Record<MinioBucket, string | undefined> = {
  pub: import.meta.env.VITE_MINIO_BUCKET_PUBLIC,
  pri: import.meta.env.VITE_MINIO_BUCKET_PRIVATE,
  data: import.meta.env.VITE_MINIO_BUCKET_DATA,
  ftp: import.meta.env.VITE_MINIO_BUCKET_FTP,
}

export function useMinio() {
  /**
   * 获取Minio客户端
   */
  function getClient() {
    const { isDesktop } = useUser()
    const endPoint = isDesktop.value ? import.meta.env.VITE_MINIO_ENDPOINT_INTERNAL : import.meta.env.VITE_MINIO_ENDPOINT_EXTERNAL
    return createClient({
      endPoint,
      port: getEnvVariable('VITE_MINIO_PORT'),
      useSSL: getEnvVariable('VITE_MINIO_USE_SSL', false),
      accessKey: import.meta.env.VITE_MINIO_AK,
      secretKey: import.meta.env.VITE_MINIO_SK,
    })
  }

  /**
   * 上传文件
   */
  async function uploadFile(bucket: MinioBucket, path: string, file: File) {
    return new Promise((resolve, reject) => {
      const client = getClient()
      const reader = new FileReader()

      reader.onload = async function (event) {
        const content = event.target?.result
        const buf = Bufferfrom(content)
        try {
          const res = await client.putObject(minioConfig[bucket], path, buf, { 'Content-Type': 'application/octet-stream' })
          resolve(res)
        }
        catch (e) {
          reject(e)
        }
      }

      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * 签发上传链接
   */
  async function signUploadLink(bucket: MinioBucket, path: string, expires = 60) {
    return await getClient().presignedUrl('put', minioConfig[bucket], path, expires)
  }

  /**
   * 签发下载链接
   */
  async function signDownloadLink(bucket: MinioBucket, path: string, expires = 60) {
    return await getClient().presignedUrl('get', minioConfig[bucket], path, expires)
  }

  /**
   * 批量删除文件
   */
  async function batchDeleteFiles(bucket: MinioBucket, paths: string[]) {
    return await getClient().removeObjects(minioConfig[bucket], paths)
  }

  return {
    minioConfig,
    getClient,
    uploadFile,
    signUploadLink,
    signDownloadLink,
    batchDeleteFiles,
  }
}
