<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean,
}>()
defineEmits(['update:modelValue'])

const { logout } = useUser()
const value = useVModel(props, 'modelValue')
</script>

<template>
  <ZDialog
    v-model="value"
    title="退出登录"
    confirm-text="退出"
    footer
    :wrapperStyle="{
      width: '488px'
    }"
    @ok="logout"
  >
    是否退出登录？
  </ZDialog>
</template>
