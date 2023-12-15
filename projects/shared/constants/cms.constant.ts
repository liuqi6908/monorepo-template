import { defineAsyncComponent, markRaw } from 'vue'
import type { CmsConfig } from '../types'

const HomeCarousel = defineAsyncComponent(() => import('../component/cms/home/HomeCarousel.vue'))
const DataIntroduce = defineAsyncComponent(() => import('../component/cms/home/DataIntroduce.vue'))
const Footer = defineAsyncComponent(()=>import('../component/cms/home/Footer.vue'))
const Question = defineAsyncComponent(()=>import('../component/cms/question/Question.vue'))
const UpdateDescribe = defineAsyncComponent(()=>import('../component/cms/user/UpdateDescribe.vue'))

/**
 * CMS 配置
 */
export const CMS_CONFIG: CmsConfig[] = [
  {
    id: 'homeCarousel',
    label: '首页轮播图',
    component: markRaw(HomeCarousel),
    param: ['title', 'img','richText', 'delete', 'sort', 'add'],
    rows: []
  },
  {
    id: 'homeDataIntroduce',
    label: '平台介绍',
    component: markRaw(DataIntroduce),
    param: ['title', 'richText'],
    rows: [{ title: '', richText: '' }]
  },
  {
    id: 'footer',
    label: '联系方式',
    component: markRaw(Footer),
    param: ['title', 'richText','delete', 'sort', 'add',],
    rows: []
  },
  {
    id: 'questionItem',
    label: '问答管理',
    component: markRaw(Question),
    param: ['title', 'svg', 'richText', 'delete', 'sort', 'add'],
    rows: []
  },
  {
    id: 'homeUpdateDescribe',
    label: '数据上传说明',
    component: markRaw(UpdateDescribe),
    param: ['richText'],
    rows: [{ richText: '' }]
  },
]