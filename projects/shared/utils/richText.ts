import { isClient } from '@vueuse/core'

/**
 * 富文本处理器
 */
export class RichTextProcessor {
  private _div!: HTMLDivElement

  constructor(public raw: string) {
    if (isClient) {
      this._div = document.createElement('div')
      this._div.innerHTML = raw
    }
  }

  static from(raw: string) {
    return new RichTextProcessor(raw)
  }

  /**
   * 懒加载图片
   */
  lazyLoadImages() {
    const images = this._div.querySelectorAll('img')

    images.forEach((img) => {
      img.setAttribute('loading', 'lazy')
    })
    return this
  }

  /**
   * 获取html
   */
  get html() {
    return this._div.innerHTML
  }
}
