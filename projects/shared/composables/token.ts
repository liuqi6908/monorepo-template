import { useStorage } from '@vueuse/core'
import { AUTH_TOKEN_KEY } from '~/constants'

/** 用户token */
export const authToken = useStorage(AUTH_TOKEN_KEY, '')
