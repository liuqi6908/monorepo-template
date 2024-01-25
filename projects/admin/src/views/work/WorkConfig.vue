<script lang="ts" setup>
import { Notify } from 'quasar'
import { fileSizeToBytes, formatFileSize } from 'zjf-utils'
import {
  UPLOAD_WORK_DFT_SIZE_LIMIT,
  PermissionType,
  SysConfig,
} from 'zjf-types'
import type { IConfigDto } from 'zjf-types'
import type { InfoItemProps, UpdateParam } from '~/components/item/InfoItem.vue'

const { adminRole } = useUser()
const { works, getWorkConfig } = useSysConfig()

/** 加载中 */
const loading = ref(false)

/**
 * 是否可以编辑
 */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.CONFIG_UPSERT_WORK))

/** 上传作品信息 */
const info = computed<(Omit<InfoItemProps, 'isEdit'> & {
  key: keyof Exclude<IConfigDto[SysConfig.WORK], undefined>
})[]>(() => {
  const sizeLimit = formatFileSize(works.value?.sizeLimit ?? UPLOAD_WORK_DFT_SIZE_LIMIT)
  return [
    {
      label: '上传作品尺寸限制',
      key: 'sizeLimit',
      modelValue: sizeLimit,
      text: Number(sizeLimit.split(' ')[0]),
      unit: sizeLimit.split(' ')[1],
      type: 'fileSize',
    },
    {
      label: '上传作品可接受文件后缀',
      key: 'acceptLimit',
      modelValue: works.value?.acceptLimit?.join('、'),
      arr: works.value?.acceptLimit,
      type: 'fileSuffix',
    },
    {
      label: '上传作品提示信息',
      key: 'hint',
      modelValue: works.value?.hint,
    },
    {
      label: '上传作品数量限制',
      caption: '（0表示没有限制）',
      key: 'amount',
      modelValue: works.value?.amount?.toString(),
      text: works.value?.amount,
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
    await getWorkConfig(false)
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
      version: SysConfig.WORK,
      work: {
        ...works.value,
        [item.key]: undefined
      }
    })
    Notify.create({
      type: 'success',
      message: '重置成功',
    })

    await getWorkConfig(false)
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
    let { type, text, unit, arr } = val
    if (type === 'fileSize' && unit)
      text = fileSizeToBytes(`${text} ${unit}`)
    if (typeof text === 'number')
      text = Math.floor(text)
    await upsertConfigApi({
      version: SysConfig.WORK,
      work: {
        ...works.value,
        [item.key]: type === 'fileSuffix' ? arr?.filter(Boolean) : text
      }
    })
    Notify.create({
      type: 'success',
      message: '修改成功',
    })

    if (works.value)
      works.value[item.key] = (type === 'fileSuffix' ? arr?.filter(Boolean) : text) as any
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
          @update="val => update(item, val)"
        />
      </div>
    </q-scroll-area>
  </div>
</template>
