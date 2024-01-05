import { defineAsyncComponent, markRaw } from 'vue'
import type { CmsComponent, CmsConfig } from '../types/cms.interface'

/**
 * CMS 组件
 */
export const CMS_COMPONENTS: CmsComponent = {
  A0001: {
    label: '轮播图',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/A0001.vue')),
    ),
    param: ['list', 'title', 'img', 'mask', 'richText'],
  },
  A0002: {
    label: '图片+文本',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/A0002.vue')),
    ),
    param: ['title', 'img', 'richText'],
  },
  A0003: {
    label: '页脚',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/A0003.vue')),
    ),
    param: ['list', 'title', 'richText'],
  },
  A0004: {
    label: '富文本',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/A0004.vue')),
    ),
    param: ['richText'],
  },
  A0005: {
    label: '常见问题',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/A0005.vue')),
    ),
    param: ['list', 'title', 'svg', 'richText'],
  },
}

/**
 * CMS 配置
 */
export const CMS_CONFIG: CmsConfig[] = [
  {
    id: 'homeCarousel',
    label: '首页轮播图',
    component: 'A0001',
  },
  {
    id: 'platformIntroduce',
    label: '平台介绍',
    component: 'A0002',
  },
  {
    id: 'homeExpand',
    label: '首页拓展',
    component: true,
  },
  {
    id: 'question',
    label: '问答管理',
    component: 'A0005',
  },
  {
    id: 'footer',
    label: '页脚管理',
    component: 'A0003',
  },
  {
    id: 'uploadDescribe',
    label: '数据上传说明',
    component: 'A0004',
  },
]
