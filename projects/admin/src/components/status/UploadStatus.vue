<script lang="ts" setup>
interface Props {
  total?: number
  preview?: number
  download?: number
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  preview: 0,
  download: 0,
})

const disablePreview = computed(() => props.preview < props.total)
const disableDownload = computed(() => props.download < props.total)
</script>

<template>
  <div flex="~ items-center gap2">
    <div v-if="!total || (!download && !preview)" class="item">
      <div i-mingcute:minus-circle-fill />
      未上传
    </div>
    <template v-else>
      <div
        v-if="preview"
        class="item success"
        :class="{ disable: disablePreview }"
      >
        <template v-if="disablePreview">
          <div i-mingcute:more-3-fill />
          样例数据未完全上传
        </template>
        <template v-else>
          <div i-mingcute:check-circle-fill />
          样例数据
        </template>
      </div>
      <div
        v-if="download"
        class="item warning"
        :class="{ disable: disableDownload }"
      >
        <template v-if="disableDownload">
          <div i-mingcute:more-3-fill />
          下载数据未完全上传
        </template>
        <template v-else>
          <div i-mingcute:check-circle-fill />
          下载数据
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.item {
  padding: 4px 8px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--grey-1);
  background-color: var(--grey-4);

  > div:first-child {
    width: 16px;
    height: 16px;
  }

  &.success {
    background-color: var(--alerts-success);
  }

  &.warning {
    background-color: var(--alerts-warning);
  }

  &.disable {
    opacity: 0.7;
  }
}
</style>
