import type { ICms } from 'zjf-types'

const { $get } = useRequest()

export function getCms<T>(cmsId: string) {
  return $get<ICms<T>>(`/cms/${cmsId}`)
}
