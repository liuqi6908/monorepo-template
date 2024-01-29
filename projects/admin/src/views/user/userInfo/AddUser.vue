<script lang="ts" setup>
/** 对话框 */
const dialog = ref(false)

/**
 * 创建用户
 */
function createUser() {}
</script>

<template>
  <div>
    <ZBtn
      label="添加用户"
      @click="dialog = true"
    >
      <template #left>
        <div w5 h5 i-mingcute:add-line />
      </template>
    </ZBtn>

    <ZDialog
      v-model="dialog"
      title="添加用户"
      scroll footer
      confirm-text="保存"
      :wrapperStyle="{
        width: '900px',
        maxWidth: '900px',
      }"
      @ok="createUser"
    />
  </div>
</template>
