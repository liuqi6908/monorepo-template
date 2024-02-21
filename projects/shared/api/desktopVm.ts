import type { IDesktop } from 'zjf-types'
import type {
  DesktopVM,
  DesktopVMState,
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
export function getVMStateApi(desktopId: IDesktop['id']) {
  return $get<VMState>(`/desktop-vm/${desktopId}`)
}

/**
 * 获取指定虚拟机的详情
 */
export function getVMDetailApi(desktopId: IDesktop['id']) {
  return $get<VMDetail>(`/desktop-vm/detail/${desktopId}`)
}

/**
 * 开机指定的虚拟机
 */
export function startVMApi(desktopId: IDesktop['id']) {
  return $post(`/desktop-vm/boot/${desktopId}`)
}

/**
 * 批量开机虚拟机
 */
export function batchStartVMApi(body: IDesktop['id'][]) {
  return $post('/desktop-vm/batch/boot', body)
}

/**
 * 关机指定的虚拟机
 */
export function stopVMApi(desktopId: IDesktop['id']) {
  return $post(`/desktop-vm/shutdown/${desktopId}`)
}

/**
 * 批量关机虚拟机
 */
export function batchStopVMApi(body: IDesktop['id'][]) {
  return $post('/desktop-vm/batch/shutdown', body)
}

/**
 * 重启指定的虚拟机
 */
export function rebootVMApi(desktopId: IDesktop['id']) {
  return $post(`/desktop-vm/reboot/${desktopId}`)
}

/**
 * 批量重启虚拟机
 */
export function batchRebootVMApi(body: IDesktop['id'][]) {
  return $post('/desktop-vm/batch/reboot', body)
}

/**
 * 获取云桌面虚拟机列表
 */
export function getVMListApi() {
  return $get<DesktopVM[]>('/desktop-vm/list/info')
}

/**
 * 获取云桌面虚拟机状态列表
 */
export function getVMStateListApi() {
  return $get<DesktopVMState[]>(
    '/desktop-vm/list/state', undefined, undefined,
    {
      headers: {
        notify: false,
      },
    },
  )
}
