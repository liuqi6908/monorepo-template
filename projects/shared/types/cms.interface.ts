import type { Component } from 'vue'

/**
 * Cms 配置参数
 */
export type CmsConfigParam = 'title' | 'img' | 'svg' | 'richText' | 'delete' | 'sort' | 'add'

/**
 * Cms Json
 */
export type CmsJson = Partial<Record<CmsConfigParam, string>>

/**
 * Cms 配置
 */
export interface CmsConfig {
  id: string
  label: string
  component: Component
  param: CmsConfigParam[]
  rows: CmsJson[]
}