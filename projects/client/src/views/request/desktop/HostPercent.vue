<script setup lang="ts">
const props = defineProps<{
  uuid?: string
}>()

const { pause, resume } = useIntervalFn(getHostInfo, 30000)

/** 物理机配置列表 */
const hostList = reactive({
  cpu: {
    title: 'CPU分配情况',
    color: '#025CB9',
    unit: false,
    used: 1,
    total: 100,
  },
  storage: {
    title: '内存使用率',
    unit: true,
    color: '#F99E34',
    used: 1,
    total: 100,
  },
  disk: {
    title: '存储使用率',
    unit: true,
    color: '#8D5FF0',
    used: 1,
    total: 100,
  },
})

onBeforeMount(() => {
  getHostInfo()
  resume()
})

/**
 * 获取物理机的详细信息
 */
async function getHostInfo() {
  if (!props.uuid)
    return

  try {
    const allocation = await getHostAllocationApi(props.uuid)
    if (allocation) {
      const { CPUUsedCount, CPUAvailableCount, memUsed, memAvailable } = allocation

      hostList.cpu.used = Number(CPUUsedCount[0].value)
      hostList.cpu.total = hostList.cpu.used + Number(CPUAvailableCount[0].value)

      hostList.storage.used = Number(memUsed[0].value)
      hostList.storage.total = hostList.storage.used + Number(memAvailable[0].value)
    }

    const storage = await getClusterStorageApi()

    if (storage) {
      const { UsedCapacityInBytes, TotalCapacityInBytes } = storage
      hostList.disk.used = Number(UsedCapacityInBytes[0].value)
      hostList.disk.total = Number(TotalCapacityInBytes[0].value)
    }
  }
  catch (_) {
    pause()
  }
}
</script>

<template>
  <div flex="~ gap10 wrap">
    <RoundEchartsCard
      v-for="(item, index) in hostList"
      :key="index"
      v-bind="item"
      flex-1
    />
  </div>
</template>
