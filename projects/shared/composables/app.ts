import { computed } from 'vue'
import { useFavicon, useWindowSize, useTitle } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import { APP_MIN_WIDTH } from '../constants/app'

const { width } = useWindowSize()

export function useApp() {
  /**
   * 修改 APP Head
   */
  function updateAppHead(config: {
    title?: string
    icon?: string
    description?: string
  }) {
    const { title, icon, description } = config
    title && useTitle(title)
    icon && useFavicon(icon)
    description && useHead({
      meta: [
        { name: 'description', content: description },
      ],
    })
  }

  /**
   * 窗口缩放比例
   */
  const zoomRatio = computed(() => width.value >= APP_MIN_WIDTH ? 1 : width.value / APP_MIN_WIDTH)

  return {
    updateAppHead,
    zoomRatio,
  }
}
