import { getCurrentInstance } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import type { Router } from 'vue-router'

import { AUTH_TOKEN_KEY } from '../constants/storage'

/** 用户token */
export const authToken = useStorage(AUTH_TOKEN_KEY, '')

export function useUser($router?: Router) {
  const instance = getCurrentInstance()
  if (!$router && instance)
    $router = useRouter()

  return {
    authToken,
  }
}
