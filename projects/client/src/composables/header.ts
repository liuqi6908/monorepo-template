const el = ref<HTMLElement>()

export function useAppHeader(dom?: HTMLElement) {
  if (dom)
    el.value = dom

  const { width, height } = useElementSize(el, undefined, {
    box: 'border-box',
  })

  return {
    el,
    width,
    height,
  }
}
