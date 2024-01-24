<script lang="ts" setup>
import { Notify } from 'quasar'
import { APP_NAME, APP_NAME_EN, APP_ICON, SysConfig } from 'zjf-types'
import { getRandomID } from 'zjf-utils'
import type { IConfigDto } from 'zjf-types'
import InfoItem from './InfoItem.vue'
import type { InfoItemProps } from './InfoItem.vue'

defineProps<{
  isEdit?: boolean
}>()
const emits = defineEmits(['loading'])

const { app, updateAppHead } = useSysConfig()

/** 平台信息 */
const info = computed<(Omit<InfoItemProps, 'isEdit'> & {
  key: keyof Exclude<IConfigDto[SysConfig.APP], undefined>
})[]>(() => ([
  {
    label: '平台名称',
    key: 'name',
    placeholder: APP_NAME,
    modelValue: app.value?.name,
  },
  {
    label: '平台logo',
    key: 'icon',
    placeholder: APP_ICON,
    modelValue: app.value?.icon,
    type: 'image',
    caption: '（ 只能上次 png、jpg 格式文件，且不大于 100KB）'
  },
  {
    label: '平台英文',
    key: 'nameEn',
    placeholder: APP_NAME_EN,
    modelValue: app.value?.nameEn,
  }
]))

/**
 * 重置
 */
async function reset(item: typeof info.value[number]) {
  emits('loading', true)

  try {
    await upsertConfigApi({
      version: SysConfig.APP,
      app: {
        ...app.value,
        [item.key]: undefined
      }
    })
    Notify.create({
      type: 'success',
      message: '重置成功',
    })

    if (app.value) {
      app.value[item.key] = item.placeholder
      if (item.key === 'name' || item.key === 'icon')
        updateAppHead(true)
    }
  }
  finally {
    emits('loading', false)
  }
}

/**
 * 更新
 */
async function update(item: typeof info.value[number], val: string | File) {
  emits('loading', true)

  try {
    // 修改应用图标，上传文件
    if (item.key === 'icon' && typeof val !== 'string') {
      const suffix = val.name.split('.').pop()
      const res = await uploadPublicFileApi({
        path: `app/${getRandomID()}.${suffix}`,
      }, val)
      val = `/api/file/public?path=${res}`
    }
    await upsertConfigApi({
      version: SysConfig.APP,
      app: {
        ...app.value,
        [item.key]: val
      }
    })
    Notify.create({
      type: 'success',
      message: '修改成功',
    })

    if (app.value) {
      app.value[item.key] = val as string
      if (item.key === 'name' || item.key === 'icon')
        updateAppHead(true)
    }
  }
  finally {
    emits('loading', false)
  }
}
</script>

<template>
  <div flex="~ col gap4">
    <div text-lg font-600>
      自定义平台信息
    </div>
    <div class="card">
      <InfoItem
        v-for="item in info"
        :is-edit="isEdit"
        v-bind="item"
        @reset="reset(item)"
        @update:model-value="val => update(item, val)"
      />
      <div flex="~ gap1" text-sm font-500>
        修改平台主题色
        <div text-grey-6 font-400>
          （ 请联系技术支持单位 ）
        </div>
      </div>
    </div>
  </div>
</template>
