<script lang="ts" setup>
import { Notify } from 'quasar'
import {
  PermissionType,
  SysConfig,
} from 'zjf-types'
import type { IConfigDto } from 'zjf-types'
import type { InfoItemProps, UpdateParam } from '~/components/item/InfoItem.vue'

const { adminRole } = useUser()
const { purchase, getPurchaseConfig } = useSysConfig()

/** 加载中 */
const loading = ref(false)

/**
 * 是否可以编辑
 */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.CONFIG_UPSERT_PURCHASE))

/** 申请采购信息 */
const info = computed<(Omit<InfoItemProps, 'isEdit'> & {
  key: keyof Exclude<IConfigDto[SysConfig.PURCHASE], undefined>
})[]>(() => ([
  {
    label: '数据采购申请字数限制',
    key: 'works',
    modelValue: purchase.value?.works?.toString(),
    text: purchase.value?.works,
    type: 'number',
  }
]))

onBeforeMount(initPage)

/**
 * 初始化页面
 */
async function initPage() {
  loading.value = true

  try {
    await getPurchaseConfig(false)
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
      version: SysConfig.PURCHASE,
      purchase: {
        ...purchase.value,
        [item.key]: undefined
      }
    })
    Notify.create({
      type: 'success',
      message: '重置成功',
    })

    await getPurchaseConfig(false)
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
    let { text } = val
    if (typeof text === 'number')
      text = Math.floor(text)
    await upsertConfigApi({
      version: SysConfig.PURCHASE,
      purchase: {
        ...purchase.value,
        [item.key]: text as any
      }
    })
    Notify.create({
      type: 'success',
      message: '修改成功',
    })

    if (purchase.value)
      purchase.value[item.key] = text as any
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
