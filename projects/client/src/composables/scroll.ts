import type { QScrollArea } from 'quasar'

const el = ref<InstanceType<typeof QScrollArea>>()

export function useScrollApp() {
  /**
   * 滚动
   */
  function scrollTo(
    offset: number,
    axis: 'vertical' | 'horizontal' = 'vertical',
    duration?: number,
  ) {
    el.value?.setScrollPosition(axis, offset, duration)
  }

  return {
    el,
    scrollTo,
  }
}
