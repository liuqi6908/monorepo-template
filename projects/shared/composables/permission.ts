import { useStorage } from '@vueuse/core'
import { ADMIN_ROLE_KEY } from '~/constants'

/** 用户管理权限 */
export const adminRole = useStorage<string[]>(ADMIN_ROLE_KEY, [])
