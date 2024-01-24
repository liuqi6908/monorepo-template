<script lang="ts" setup>
import { PermissionType } from 'zjf-types'
import PlatformInfo from './PlatformInfo.vue';
import NavBarInfo from './NavBarInfo.vue'

const { adminRole } = useUser()
const { getAppConfig, getNavConfig } = useSysConfig()

/** 加载中 */
const loading = ref(false)

/**
 * 是否可以编辑
 */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.CONFIG_UPSERT_APP))

onBeforeMount(initPage)

/**
 * 初始化页面
 */
async function initPage() {
  loading.value = true

  try {
    await getAppConfig(false)
    await getNavConfig(false)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div flex="~ 1 col gap4" relative class="global-config"
  >
    <ZLoading :value="loading" />

    <!-- 操作栏 -->
    <div flex="~ justify-end gap4">
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
      <div flex="~ col gap10">
        <!-- 平台信息 -->
        <PlatformInfo :isEdit="isEdit" @loading="val => loading  = val" />
        <!-- 导航栏信息 -->
        <NavBarInfo :isEdit="isEdit" @loading="val => loading  = val" />
      </div>
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped>
.global-config {
  :deep(.card) {
    background-color: var(--grey-1);
    padding: 16px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>