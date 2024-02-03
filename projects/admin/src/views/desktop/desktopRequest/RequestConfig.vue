<script lang="ts" setup>
import { Notify } from 'quasar'
import { fileSizeToBytes, formatFileSize } from 'zjf-utils'
import {
  DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT,
  PermissionType,
  SysConfig,
} from 'zjf-types'
import type { IConfigDto } from 'zjf-types'
import type { InfoItemProps, UpdateParam } from '~/components/item/InfoItem.vue'

const { adminRole } = useUser()
const { desktopRequest, getDesktopRequestConfig } = useSysConfig()

/** 加载中 */
const loading = ref(false)

/**
 * 是否可以编辑
 */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.CONFIG_UPSERT_DESKTOP_REQUEST))

/** 云桌面申请信息 */
const info = computed<(Omit<InfoItemProps, 'isEdit'> & {
  key: keyof Exclude<IConfigDto[SysConfig.DESKTOP_REQUEST], undefined>
})[]>(() => {
  const sizeLimit = formatFileSize(desktopRequest.value?.sizeLimit ?? DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT)
  return [
    {
      label: '申请时长配置',
      key: 'duration',
      modelValue: desktopRequest.value?.duration?.map(v => v.label).join('、'),
      option: desktopRequest.value?.duration,
      type: 'option',
    },
    {
      label: '上传文件尺寸限制',
      key: 'sizeLimit',
      modelValue: sizeLimit,
      text: Number(sizeLimit.split(' ')[0]),
      unit: sizeLimit.split(' ')[1],
      type: 'fileSize',
    },
    {
      label: '上传文件可接受文件后缀',
      key: 'acceptLimit',
      modelValue: desktopRequest.value?.acceptLimit?.join('、'),
      arr: desktopRequest.value?.acceptLimit,
      type: 'fileSuffix',
    },
    {
      label: '上传文件提示信息',
      key: 'hint',
      modelValue: desktopRequest.value?.hint,
    },
    {
      label: '上传文件数量限制',
      key: 'amountLimit',
      modelValue: desktopRequest.value?.amountLimit?.toString(),
      text: desktopRequest.value?.amountLimit,
      type: 'number',
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
    await getDesktopRequestConfig(false)
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
      version: SysConfig.DESKTOP_REQUEST,
      desktopRequest: {
        ...desktopRequest.value,
        [item.key]: undefined
      }
    })
    Notify.create({
      type: 'success',
      message: '重置成功',
    })

    await getDesktopRequestConfig(false)
  }
  finally {
    loading.value = false
  }
}

/**
 * 更新
 */
async function update(item: typeof info.value[number], val: UpdateParam) {
  loading.value = true

  try {
    let { type, text, unit, arr, option } = val
    if (type === 'fileSize' && unit)
      text = fileSizeToBytes(`${text} ${unit}`)
    if (typeof text === 'number')
      text = Math.floor(text)

    const value = type === 'fileSuffix'
      ? arr?.filter(Boolean)
      : type === 'option'
        ? option?.filter(v => v.label && v.value)
        : text
    await upsertConfigApi({
      version: SysConfig.DESKTOP_REQUEST,
      desktopRequest: {
        ...desktopRequest.value,
        [item.key]: value
      }
    })
    Notify.create({
      type: 'success',
      message: '修改成功',
    })

    if (desktopRequest.value)
      desktopRequest.value[item.key] = value as any
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div flex="~ col gap4" relative>
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
          @update="val => update(item, val)"
        />
      </div>
    </q-scroll-area>
  </div>
</template>
