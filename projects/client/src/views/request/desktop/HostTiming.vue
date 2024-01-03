<script setup lang="ts">
import { FILE_SIZE_UNITS } from 'zjf-utils'

const props = defineProps<{
  uuid?: string
}>()

const { pause } = useIntervalFn(getHostTiming, 30000, { immediateCallback: true })

/** 物理机时序列表 */
const hostList = reactive({
  cpu: {
    title: 'CPU',
    unit: '%',
    data: [
      {
        time: [],
        value: [],
        label: '使用率',
      },
    ],
  },
  storage: {
    title: '内存',
    unit: '%',
    data: [
      {
        time: [],
        value: [],
        label: '负载率',
      },
    ],
  },
  oi: {
    title: '磁盘',
    unit: 'KB/s',
    data: [
      {
        time: [],
        value: [],
        label: '读取',
      },
      {
        time: [],
        value: [],
        label: '写入',
      },
    ],
  },
})

/**
 * 获取物理机时序数据
 */
async function getHostTiming() {
  if (!props.uuid)
    return

  try {
    const res = await getHostTimeSeriesApi(props.uuid)
    if (res) {
      const { CPUUtilization, memUsed, diskWrite, diskRead } = res
      const { cpu, storage, oi } = hostList
      if (CPUUtilization?.length) {
        cpu.data[0].value = processData(CPUUtilization, 'value')
        cpu.data[0].time = processData(CPUUtilization, 'time')
      }
      if (memUsed?.length) {
        storage.data[0].value = processData(memUsed, 'value')
        storage.data[0].time = processData(memUsed, 'time')
      }
      if (diskWrite?.length) {
        oi.data[0].value = processData(diskWrite, 'value')
        oi.data[0].time = processData(diskWrite, 'time')
      }
      if (diskRead?.length) {
        oi.data[1].value = processData(diskRead, 'value')
        oi.data[1].time = processData(diskRead, 'time')
      }
      const max = Math.max(...oi.data[0].value, ...oi.data[1].value)
      for (let i = FILE_SIZE_UNITS.length - 1; i >= 0; i--) {
        if (max > 1024 ** i) {
          oi.unit = `${FILE_SIZE_UNITS[i]}/s`
          break
        }
      }
    }
  }
  catch (_) {
    pause()
  }
}

/**
 * 处理数据
 */
function processData(dataArray: any, property: 'value' | 'time') {
  if (dataArray?.length) {
    return dataArray.map((item: any) => {
      const { value, time } = item
      if (time)
        return property === 'value' ? value : time
      return ''
    })
  }
  return []
}
</script>

<template>
  <div flex="~ col gap10">
    <LineEchartsCard
      v-for="(item, index) in hostList"
      :key="index"
      v-bind="item"
    />
  </div>
</template>
