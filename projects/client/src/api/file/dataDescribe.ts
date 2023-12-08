import { getUrlByToken } from './getUriByToken'

/** filename 为DATABASE_ENG + .doc */
export function getDataDescribe(dataRootId: string, filename: string) {
  return getUrlByToken(`file/private/db/${dataRootId}/${filename}`)
}
