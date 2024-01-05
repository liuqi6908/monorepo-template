import type { Component } from 'vue'

/**
 * Cms 配置参数
 */
export type CmsConfigParam = 'list' | 'title' | 'img' | 'svg' | 'mask' | 'richText'

/**
 * Cms 组件
 */
export type CmsComponent = Record<
  `A${number}${number}${number}${number}`,
  {
    label: string
    component: Component
    param: CmsConfigParam[]
  }
>

/**
 * Cms Json
 */
export type CmsJson = Partial<Record<CmsConfigParam, string>> & {
  componentId?: keyof CmsComponent
}

/**
 * Cms 配置
 */
export interface CmsConfig {
  id: string
  label: string
  component: keyof CmsComponent | true
}
