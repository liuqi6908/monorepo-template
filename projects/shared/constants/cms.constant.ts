import { defineAsyncComponent, markRaw } from 'vue'
import type { CmsConfig } from '~/types'

/**
 * CMS 配置
 */
export const CMS_CONFIG: CmsConfig[] = [
  {
    id: 'homeCarousel',
    label: '首页轮播图',
    component: markRaw(
      defineAsyncComponent(() => import('~/component/cms/home/Carousel.vue')),
    ),
    param: ['title', 'img', 'richText', 'delete', 'sort', 'add'],
    rows: [],
  },
  {
    id: 'homeDataIntroduce',
    label: '平台介绍',
    component: markRaw(
      defineAsyncComponent(() => import('~/component/cms/home/DataIntroduce.vue')),
    ),
    param: ['title', 'richText'],
    rows: [{ title: '', richText: '' }],
  },
  {
    id: 'footer',
    label: '联系方式',
    component: markRaw(
      defineAsyncComponent(() => import('~/component/cms/home/Footer.vue')),
    ),
    param: ['title', 'richText', 'delete', 'sort', 'add'],
    rows: [],
  },
  {
    id: 'questionItem',
    label: '问答管理',
    component: markRaw(
      defineAsyncComponent(() => import('~/component/cms/question/Question.vue')),
    ),
    param: ['title', 'svg', 'richText', 'delete', 'sort', 'add'],
    rows: [],
  },
  {
    id: 'homeUpdateDescribe',
    label: '数据上传说明',
    component: markRaw(
      defineAsyncComponent(() => import('~/component/cms/user/UpdateDescribe.vue')),
    ),
    param: ['richText'],
    rows: [{ richText: '' }],
  },
]
