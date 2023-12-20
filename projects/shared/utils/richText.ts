/**
 * 富文本处理器
 */
export class RichTextProcessor {
  private _div!: HTMLDivElement

  constructor(public raw: string) {
    if (typeof document !== 'undefined') {
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

    images.forEach((img: HTMLImageElement) => {
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
