import { defineAsyncComponent, markRaw } from 'vue'
import type { CmsConfig } from '../types/cms.interface'

/**
 * CMS 配置
 */
export const CMS_CONFIG: CmsConfig[] = [
  {
    id: 'homeCarousel',
    label: '首页轮播图',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/home/Carousel.vue')),
    ),
    param: ['title', 'img', 'richText', 'delete', 'sort', 'add'],
    rows: [],
  },
  {
    id: 'homePlatformIntroduce',
    label: '平台介绍',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/home/PlatformIntroduce.vue')),
    ),
    param: ['title', 'richText'],
    rows: [{ title: '', richText: '' }],
  },
  {
    id: 'homeContent',
    label: '首页内容',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/home/Content.vue')),
    ),
    param: ['richText', 'delete', 'sort', 'add'],
    rows: [{ richText: '' }],
  },
  {
    id: 'footer',
    label: '联系方式',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/home/Footer.vue')),
    ),
    param: ['title', 'richText', 'delete', 'sort', 'add'],
    rows: [],
  },
  {
    id: 'question',
    label: '问答管理',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/question/Question.vue')),
    ),
    param: ['title', 'svg', 'richText', 'delete', 'sort', 'add'],
    rows: [],
  },
  {
    id: 'updateDescribe',
    label: '数据上传说明',
    component: markRaw(
      defineAsyncComponent(() => import('../components/cms/user/UpdateDescribe.vue')),
    ),
    param: ['richText'],
    rows: [{ richText: '' }],
  },
]
