<script lang="ts" setup>
import { Notify } from 'quasar'
import {
  NAV_HOME_LABEL,
  NAV_HOME_DESC,
  NAV_DATABASE_LABEL,
  NAV_DATABASE_DESC,
  NAV_QUESTION_LABEL,
  NAV_QUESTION_DESC,
  NAV_REQUEST_LABEL,
  NAV_REQUEST_DESC,
  SysConfig,
} from 'zjf-types'
import type { IConfigDto } from 'zjf-types'
import InfoItem from './InfoItem.vue'
import type { InfoItemProps } from './InfoItem.vue'

defineProps<{
  isEdit?: boolean
}>()
const emits = defineEmits(['loading'])

const { nav } = useSysConfig()

/** 菜单 */
const menu = [
  {
    label: '导航栏文字',
    id: 'nav',
  },
  {
    label: 'banner 文字',
    id: 'banner',
  },
]
/** 当前激活菜单 */
const active = ref<string>(menu[0].id)

/** 平台信息 */
const info = computed<(Omit<InfoItemProps, 'isEdit'> & {
  key: keyof Exclude<IConfigDto[SysConfig.NAV], undefined>
  menu: string
})[]>(() => ([
  {
    label: '首页',
    key: 'homeLabel',
    placeholder: NAV_HOME_LABEL,
    modelValue: nav.value?.homeLabel,
    menu: 'nav',
  },
  {
    label: '数据库',
    key: 'databaseLabel',
    placeholder: NAV_DATABASE_LABEL,
    modelValue: nav.value?.databaseLabel,
    menu: 'nav',
  },
  {
    label: '常见问题',
    key: 'questionLabel',
    placeholder: NAV_QUESTION_LABEL,
    modelValue: nav.value?.questionLabel,
    menu: 'nav',
  },
  {
    label: '申请使用',
    key: 'requestLabel',
    placeholder: NAV_REQUEST_LABEL,
    modelValue: nav.value?.requestLabel,
    menu: 'nav',
  },
  {
    label: '用户中心',
    key: 'homeDesc',
    placeholder: NAV_HOME_DESC,
    modelValue: nav.value?.homeDesc,
    menu: 'banner',
  },
  {
    label: '数据库',
    key: 'databaseDesc',
    placeholder: NAV_DATABASE_DESC,
    modelValue: nav.value?.databaseDesc,
    menu: 'banner',
  },
  {
    label: '常见问题',
    key: 'questionDesc',
    placeholder: NAV_QUESTION_DESC,
    modelValue: nav.value?.questionDesc,
    menu: 'banner',
  },
  {
    label: '申请使用',
    key: 'requestDesc',
    placeholder: NAV_REQUEST_DESC,
    modelValue: nav.value?.requestDesc,
    menu: 'banner',
  },
]))

/**
 * 重置
 */
async function reset(item: typeof info.value[number]) {
  emits('loading', true)

  try {
    await upsertConfigApi({
      version: SysConfig.NAV,
      nav: {
        ...nav.value,
        [item.key]: undefined
      }
    })
    Notify.create({
      type: 'success',
      message: '重置成功',
    })

    if (nav.value)
      nav.value[item.key] = item.placeholder
  }
  finally {
    emits('loading', false)
  }
}

/**
 * 更新
 */
async function update(item: typeof info.value[number], val: string) {
  emits('loading', true)

  try {
    await upsertConfigApi({
      version: SysConfig.NAV,
      nav: {
        ...nav.value,
        [item.key]: val
      }
    })
    Notify.create({
      type: 'success',
      message: '修改成功',
    })

    if (nav.value)
      nav.value[item.key] = val
  }
  finally {
    emits('loading', false)
  }
}
</script>

<template>
  <div flex="~ col gap4">
    <div text-lg font-600>
      自定义导航栏
    </div>
    <div class="card">
      <SubMenu v-model="active" :list="menu" />
      <InfoItem
        v-for="item in info.filter(v => v.menu === active)"
        :is-edit="isEdit"
        :resetText="menu.find(v => v.id === active)?.label"
        v-bind="item"
        @reset="reset(item)"
        @update:model-value="val => update(item, val)"
      />
    </div>
  </div>
</template>
