<script setup lang="ts">
import { FILE_SIZE_UNITS } from 'zjf-utils'

const { pause } = useIntervalFn(getVMDetail, 30000)
const { vmInfo } = useDesktop()

/** 虚拟机详情列表 */
const vmList: Record<string, {
  title: string
  unit: string
  data: {
    time: number[]
    value: number[]
    label: string
  }[]
}> = reactive({
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
  network: {
    title: '网卡读取速率',
    unit: 'KB/s',
    data: [
      {
        time: [],
        value: [],
        label: '上行',
      },
      {
        time: [],
        value: [],
        label: '下行',
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
})

onBeforeMount(getVMDetail)

/**
 * 获取虚拟机详情
 */
async function getVMDetail() {
  const id = vmInfo.value?.uuid
  if (!id)
    return

  try {
    const res = await getVMDetailApi(id)
    if (res) {
      let { CPU, memUsed, NetworkIn, NetworkOut } = res
      const { cpu, network, storage } = vmList
      if (!CPU?.length)
        CPU = defaultData()
      cpu.data[0].value = CPU.map(v => v.value)
      cpu.data[0].time = CPU.map(v => v.time)

      if (!memUsed?.length)
        memUsed = defaultData()
      storage.data[0].value = memUsed.map(v => v.value)
      storage.data[0].time = memUsed.map(v => v.time)

      if (!NetworkIn?.length)
        NetworkIn = defaultData()
      network.data[0].value = NetworkIn.map(v => v.value)
      network.data[0].time = NetworkIn.map(v => v.time)

      if (!NetworkOut?.length)
        NetworkOut = defaultData()
      network.data[1].value = NetworkOut.map(v => v.value)
      network.data[1].time = NetworkOut.map(v => v.time)

      const max = Math.max(...network.data[0].value, ...network.data[1].value)
      for (let i = FILE_SIZE_UNITS.length - 1; i >= 0; i--) {
        if (max > 1024 ** i) {
          network.unit = `${FILE_SIZE_UNITS[i]}/s`
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
 * 返回默认值
 */
function defaultData() {
  return [{ value: 0, time: new Date().getTime() / 1000 }]
}
</script>

<template>
  <div flex="~ col gap4">
    <LineEchartsCard
      v-for="(item, index) in vmList"
      :key="index"
      y-axis p="4!"
      v-bind="item"
    />
  </div>
</template>
