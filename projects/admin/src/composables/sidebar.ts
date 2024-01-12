import { isClient } from '@vueuse/core'

/** 是否展开侧边栏 */
const isExpand = ref(true)
/** 是否显示元素 */
const isShow = ref(true)

/** 过渡动画时间(ms) */
const time = 300
/** 定时器 */
let timeout: number | undefined

export function useSidebar() {
  /**
   * 切换侧边栏的展开状态
   */
  function changeState() {
    if (!isClient)
      return

    clearTimeout(timeout)
    isExpand.value = !isExpand.value
    if (isExpand.value) {
      isShow.value = true
    }
    else {
      timeout = window.setTimeout(() => {
        isShow.value = false
      }, time)
    }
  }

  return {
    isExpand,
    isShow,
    time,
    changeState,
  }
}
