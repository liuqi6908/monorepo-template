import type { DesktopStatus } from 'zjf-types'

/**
 * 云桌面虚拟机
 */
export interface DesktopVM {
  uuid: string
  name: string
  ip: string
}

/**
 * 云桌面物理机
 */
export interface DesktopHost {
  name: string
  uuid: string
}

type Value = {
  value: number
  time: number
}

/**
 * 云桌面物理机的CPU、内存分配详情
 */
export interface HostAllocation {
  // CPU
  CPUAvailableCountTotal: number
  CPUUsedCountTotal: number
  CPUUsedPercentTotal: number
  CPUAvailableCount: Value[]
  CPUUsedCount: Value[]
  CPUUsedPercent: Value[]
  // 内存
  memAvailableTotal: number
  memUsedTotal: number
  memUsedPercentTotal: number
  memAvailable: Value[]
  memUsed: Value[]
  memUsedPercent: Value[]
  // 磁盘
  diskTotalTotal: number
  diskUsedTotal: number
  diskUsedPercentTotal: number
  diskTotal: Value[]
  diskUsed: Value[]
  diskUsedPercent: Value[]
}

/**
 * 云桌面物理机的时序数据
 */
export interface HostTimeSeries {
  // cpu
  CPUUtilizationTotal: number
  CPUUtilization: Value[]
  // 内存
  memUsedTotal: number
  memUsed: Value[]
  // 磁盘（读）
  diskReadTotal: number
  diskRead: Value[]
  // 磁盘（写）
  diskWriteTotal: number
  diskWrite: Value[]
}

/**
 * 集群整体的存储使用情况
 */
export interface ClusterStorage {
  // 总容量
  TotalCapacityInBytes: Value[]
  TotalCapacityInBytesTotal: number
  // 已用容量
  UsedCapacityInBytes: Value[]
  UsedCapacityInBytesTotal: number
  // 已用容量占总容量的百分比
  UsedCapacityInPercent: Value[]
  UsedCapacityInPercentTotal: number
}

/**
 * 云桌面总览
 */
export interface VMOverview {
  /** 总数 */
  total: number
  /** 运行中的数量 */
  running: number
  /** 停止的数量 */
  stopped: number
}

/**
 * 虚拟机状态
 */
export interface VMState {
  uuid: string
  /** 平台 */
  platform: string
  /** CPU架构 */
  architecture: string
  /** 虚拟机类型 */
  hypervisorType: string
  /** 内存 */
  memorySize: number
  /** CPU */
  cpuNum: number
  /** 最后操作时间 */
  lastOpDate: string
  /** 启用状态 */
  state: DesktopStatus
  /** 操作系统 */
  guestOsType: string
}

/**
 * 虚拟机详情
 */
export interface VMDetail {
  // cpu
  CPUTotal: number
  CPU: Value[]
  // 内存
  memUsedTotal: number
  memUsed: Value[]
  // 磁盘
  DiskTotal: number
  Disk: Value[]
  // 网卡（下行）
  NetworkOutTotal: number
  NetworkOut: Value[]
  // 网卡（上行）
  NetworkInTotal: number
  NetworkIn: Value[]
}