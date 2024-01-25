<script lang="ts" setup>
import { Notify } from 'quasar'
import { fileSizeToBytes, formatFileSize } from 'zjf-utils'
import {
  EXPORT_DFT_SM_SIZE_LIMIT,
  EXPORT_DFT_LG_SIZE_LIMIT,
  PermissionType,
  SysConfig,
} from 'zjf-types'
import type { IConfigDto } from 'zjf-types'
import type { InfoItemProps } from '~/components/item/InfoItem.vue'

const { adminRole } = useUser()
const { fileExport, getFileExportConfig } = useSysConfig()

/** 加载中 */
const loading = ref(false)

/**
 * 是否可以编辑
 */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.CONFIG_UPSERT_EXPORT))

/** 文件外发信息 */
const info = computed<(Omit<InfoItemProps, 'isEdit'> & {
  key: keyof Exclude<IConfigDto[SysConfig.EXPORT], undefined>
})[]>(() => {
  const sizeLimitSm = formatFileSize(fileExport.value?.sizeLimitSm ?? EXPORT_DFT_SM_SIZE_LIMIT)
  const sizeLimitLg = formatFileSize(fileExport.value?.sizeLimitLg ?? EXPORT_DFT_LG_SIZE_LIMIT)
  return [
    {
      label: '小文件外发尺寸限制',
      key: 'sizeLimitSm',
      modelValue: sizeLimitSm,
      text: Number(sizeLimitSm.split(' ')[0]),
      unit: sizeLimitSm.split(' ')[1],
      type: 'fileSize',
    },
    {
      label: '小文件每日外发数量限制',
      key: 'dailyLimit',
      modelValue: fileExport.value?.dailyLimit?.toString(),
      text: fileExport.value?.dailyLimit,
      type: 'number',
    },
    {
      label: '大文件外发尺寸限制',
      key: 'sizeLimitLg',
      modelValue: sizeLimitLg,
      text: Number(sizeLimitLg.split(' ')[0]),
      unit: sizeLimitLg.split(' ')[1],
      type: 'fileSize',
    }
  ]
})

onBeforeMount(initPage)

/**
 * 初始化页面
 */
async function initPage() {
  loading.value = true

  try {
    await getFileExportConfig(false)
  }
  finally {
    loading.value = false
  }
}

/**
 * 重置
 */
async function reset(item: typeof info.value[number]) {
  loading.value = true

  try {
    await upsertConfigApi({
      version: SysConfig.EXPORT,
      export: {
        ...fileExport.value,
        [item.key]: undefined
      }
    })
    Notify.create({
      type: 'success',
      message: '重置成功',
    })

    await getFileExportConfig(false)
  }
  finally {
    loading.value = false
  }
}

/**
 * 更新
 */
async function update(item: typeof info.value[number], val: number, unit?: string) {
  loading.value = true

  try {
    if (unit)
      val = fileSizeToBytes(`${val} ${unit}`)
    await upsertConfigApi({
      version: SysConfig.EXPORT,
      export: {
        ...fileExport.value,
        [item.key]: val
      }
    })
    Notify.create({
      type: 'success',
      message: '修改成功',
    })

    if (fileExport.value)
      fileExport.value[item.key] = val
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div flex="~ col gap4" full relative>
    <ZLoading :value="loading" />

    <!-- 操作栏 -->
    <div flex="~ justify-end">
      <ZBtn
        label="刷新"
        text-color="primary-1"
        :params="{
          outline: true
        }"
        @click="initPage"
      >
        <template #left>
          <div w5 h5 i-mingcute:refresh-1-line />
        </template>
      </ZBtn>
    </div>

    <!-- 内容编辑区 -->
    <q-scroll-area flex-1 h0>
      <div flex="~ col gap6">
        <InfoItem
          v-for="item in info"
          :is-edit="isEdit"
          v-bind="item"
          @reset="reset(item)"
          @update:model-value="(val, unit) => update(item, val, unit)"
        />
      </div>
    </q-scroll-area>
  </div>
</template>
