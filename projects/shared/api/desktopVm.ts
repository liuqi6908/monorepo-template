import type {
  VMDetail,
  VMOverview,
  VMState,
} from '../types/desktop.interface'
import { useRequest } from '../composables/request'

const { $get, $post } = useRequest()

/**
 * 云桌面总览
 */
export function getVMOverviewApi() {
  return $get<VMOverview>('/desktop-vm')
}

/**
 * 获取指定虚拟机的状态
 */
export function getVMStateApi(desktopId: string) {
  return $get<VMState>(`/desktop-vm/${desktopId}`)
}

/**
 * 获取指定虚拟机的详情
 */
export function getVMDetailApi(desktopId: string) {
  return $get<VMDetail>(`/desktop-vm/detail/${desktopId}`)
}

/**
 * 开机指定的虚拟机
 */
export function startVMApi(desktopId: string) {
  return $post(`/desktop-vm/boot/${desktopId}`)
}

/**
 * 关机指定的虚拟机
 */
export function stopVMApi(desktopId: string) {
  return $post(`/desktop-vm/shutdown/${desktopId}`)
}

/**
 * 重启指定的虚拟机
 */
export function rebootVMApi(desktopId: string) {
  return $post(`/desktop-vm/reboot/${desktopId}`)
}
