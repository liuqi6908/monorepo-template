import { useFavicon, useTitle } from '@vueuse/core'
import { useHead } from '@vueuse/head'

export function useApp() {
  /**
   * 修改 APP Head
   */
  function updateAppHead(title?: string, icon?: string, description?: string) {
    useTitle(title)
    useHead({
      meta: [
        {
          name: 'description',
          content: description,
        },
      ],
    })
    useFavicon(icon)
  }

  return {
    updateAppHead,
  }
}
