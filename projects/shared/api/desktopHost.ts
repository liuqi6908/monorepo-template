import type {
  ClusterStorage,
  DesktopHost,
  HostAllocation,
  HostTimeSeries,
} from '~/types'
import { useRequest } from '~/composables'

const { $get } = useRequest()

/**
 * 获取云桌面物理机列表
 */
export function getHostListApi() {
  return $get<DesktopHost[]>('/desktop-host')
}

/**
 * 获取指定物理机的CPU、内存分配
 */
export function getHostAllocationApi(hostId: string) {
  return $get<HostAllocation>(`/desktop-host/${hostId}`)
}

/**
 * 获取指定物理机的时序数据
 */
export function getHostTimeSeriesApi(hostId: string) {
  return $get<HostTimeSeries>(`/desktop-host/time-series/${hostId}`)
}

/**
 * 获取集群整体的存储使用情况
 */
export function getClusterStorageApi() {
  return $get<ClusterStorage>('/desktop-host/cluster/storage')
}
