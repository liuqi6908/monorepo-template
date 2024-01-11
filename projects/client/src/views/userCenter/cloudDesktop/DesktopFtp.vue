<script lang="ts" setup>
const { isDesktop } = useUser()
</script>

<template>
  <div flex="~ col gap4">
    <div font-600>
      数据上传至云桌面
    </div>
    <div
      v-if="!isDesktop"
      p="y2 x4" bg="alerts-error/8"
      text="sm center alerts-error" font-400
    >
      注意：上传成功后请在云桌面中登录本平台进行数据下载！
    </div>
    <div flex="~ col gap4" p4 bg-grey-2>
      <div flex="~ items-center justify-between wrap">
        <div flex="~ gap2" text="sm grey-5" font-500>
          <div v-text="`配额：10GB`" />
          <div>/</div>
          <div v-text="`可用：7.00GB`" />
        </div>
        <div flex="~ gap5">
          <div>
            搜索框
          </div>
          <ZBtn
            label="删除"
            size="small" w22
            text-color="alerts-error"
            :params="{
              outline: true
            }"
          />
          <ZBtn
            v-if="!isDesktop"
            label="上传"
            size="small" w22
            text-color="primary-1"
            :params="{
              outline: true
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
