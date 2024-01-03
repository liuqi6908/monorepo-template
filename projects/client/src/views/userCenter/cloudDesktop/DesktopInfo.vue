<script lang="ts" setup>
import { desktopStatusDescriptions } from 'zjf-types'
import { formatFileSize } from 'zjf-utils'
import moment from 'moment'
import VmTiming from './VmTiming.vue'

const { vmInfo } = useDesktop()

/** 虚拟机信息 */
const vmTable = computed(() => [
  {
    label: '启用状态',
    value: vmInfo.value ? desktopStatusDescriptions[vmInfo.value?.state] : ''
  },
  {
    label: '虚拟机类型',
    value: vmInfo.value?.hypervisorType
  },
  {
    label: 'CPU架构',
    value: vmInfo.value?.architecture
  },
  {
    label: 'CPU',
    value: `${vmInfo.value?.cpuNum} 核`
  },
  {
    label: '内存',
    value: formatFileSize(vmInfo.value?.memorySize ?? 0)
  },
  {
    label: '平台',
    value: vmInfo.value?.platform
  },
  {
    label: '操作系统',
    value: vmInfo.value?.guestOsType
  },
  {
    label: 'UUID',
    value: vmInfo.value?.uuid
  },
  {
    label: '最后操作时间',
    value: moment(vmInfo.value?.lastOpDate).format('YYYY-MM-DD HH:mm:ss')
  },
])
</script>

<template>
  <div flex="~ col gap6" lg="flex-row" xl="gap10">
    <div flex="~ 1 col" lg="w0" b="1px grey-3">
      <div p4 font-600 bg-grey-2>
        基本信息
      </div>
      <div
        v-for="(item, index) in vmTable"
        :key="index"
        p="y6 x4" flex="~ 1 items-center gap2.5"
        :bg="index % 2 === 0 ? 'grey-1' : 'primary-1/6'"
      >
        <div w30 v-text="`${item.label}：`" />
        <div flex-1 w0 truncate v-text="item.value" />
      </div>
    </div>

    <div flex="~ 1 col" lg="w0" b="1px grey-3">
      <div p4 font-600 bg-grey-2>
        监控数据
      </div>
      <VmTiming v-if="vmInfo?.uuid" />
    </div>
  </div>
</template>
