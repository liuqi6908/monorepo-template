<script lang="ts" setup>
import type { ECBasicOption } from 'echarts/types/dist/shared'
import { formatFileSize } from 'zjf-utils'

interface RoundEchartsCardProps {
  title: string
  color: string
  unit?: boolean
  total: number
  used: number
}

const props = defineProps<RoundEchartsCardProps>()

/** 百分比 */
const percent = computed(() => {
  const { color, total, used } = props
  const val = (used / total) * 100 || 0
  return [
    { value: val, color },
    { value: 100 - val, color: '#025CB91F' },
  ]
})

/** 处理之后的数值 */
const finalVal = computed(() => {
  const { unit, total, used } = props

  let newUsed = ''
  let newTotal = ''

  if (unit) {
    newUsed = formatFileSize(used)
    newTotal = formatFileSize(total)
  }
  else {
    newUsed = used.toString()
    newTotal = total.toString()
  }

  return { newTotal, newUsed }
})

/** ECharts 图表配置项 */
const options = computed<ECBasicOption>(() => {
  return {
    color: percent.value.map(v => v.color),
    series: [
      {
        type: 'pie',
        radius: ['60%', '93%'],
        center: ['50%', '50%'],
        labelLine: {
          show: false,
        },
        data: percent.value,
      },
    ],
  }
})
</script>

<template>
  <div p6 b="1px grey-3" flex="~ col gap4">
    <h4 v-text="title" />
    <div flex="~ items-center gap4 self-center">
      <client-only>
        <VChart
          :option="options"
          autoresize h42 w42
        />
      </client-only>
      <h2 v-text="`${Number(percent[0].value).toFixed(2)}%`" />
    </div>
    <div flex="~ justify-between" text="base grey-5" font-600>
      <div>已用：<span text-grey-8 v-text="finalVal.newUsed" /></div>
      <div>总量：<span text-grey-8 v-text="finalVal.newTotal" /></div>
    </div>
  </div>
</template>
