import type { Component } from 'vue'

/**
 * Cms 配置参数
 */
export type CmsConfigParam = 'list' | 'title' | 'img' | 'svg' | 'mask' | 'richText'

/**
 * Cms 组件 key
 */
export type CmsKey = `A${number}${number}${number}${number}`

/**
 * Cms 组件
 */
export type CmsComponent = Record<
  CmsKey,
  {
    label: string
    icon: string
    color: string
    component: Component
    param: CmsConfigParam[]
  }
>

/**
 * Cms Json
 */
export type CmsJson = Partial<Record<CmsConfigParam, string>> & {
  id: string
  componentId?: CmsKey
  label?: string
  json?: Partial<Record<CmsConfigParam | 'id', string>>[]
}

/**
 * Cms 配置
 */
export interface CmsConfig {
  id: string
  label: string
  component: CmsKey | true
}
