import { ref } from 'vue'
import type { IUser } from 'zjf-types'

/** 用户信息 */
export const userInfo = ref<IUser>()
/** 用户信息获取时间 */
export const getTime = ref<number>()
