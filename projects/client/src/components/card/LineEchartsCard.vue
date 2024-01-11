<script lang="ts" setup>
import * as echarts from 'echarts'
import moment from 'moment'
import { FILE_SIZE_UNITS } from 'zjf-utils'
import type { ECBasicOption } from 'echarts/types/dist/shared'

interface LineEchartsCardProps {
  title: string
  unit: string
  data?: {
    value: number[]
    time: number[]
    label: string
  }[]
  yAxis?: boolean
}

const props = defineProps<LineEchartsCardProps>()

const color = ['#025CB9', '#F99E34']

/** ECharts 图表配置项 */
const options = computed<ECBasicOption>(() => {
  const { data, unit, title } = props

  const lineStyle = { color: '#D4DDEA' }
  const baseOpt: any = {
    color,
    legend: {
      icon: 'rect',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 40,
      left: -4,
      top: 6,
      width: 1000
    },
    grid: {
      left: 1,
      right: 5,
      top: 50,
      bottom: 1,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        lineStyle,
      },
      axisLabel: {
        color: '#6E7686',
        interval: 0,
        align: 'left'
      },
    },
    yAxis: {
      type: 'value',
      splitNumber: title.includes('网卡') ? 4 : 2,
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: props.yAxis,
        color: '#6E7686',
        formatter: `{value}${unit}`
      },
      splitLine: {
        lineStyle: {
          ...lineStyle,
          type: 'dashed',
        },
      },
    },
    series: [],
  }

  if (data?.length) {
    const { legend, xAxis, series } = baseOpt

    const timeArr = data[0].time.map(v => timestampToTime(v))
    // 坐标轴上显示4个x的刻度值
    const interval = Math.ceil(timeArr.length / 4)
    xAxis.data = timeArr.map((v, i) => i % interval === 0 ? v : '')
    xAxis.axisLabel.interval = interval - 1

    series.push(...data.map((v, i) => formatterSeries(v.value, color[i % 2], v.label)))

    const names = series.map((item: any, index: number) => ({
      label: data[index].label,
      name: item.name,
    }))
    baseOpt.legend = {
      ...legend,
      ...formatterLegend(names),
    }
  }

  return baseOpt
})

/**
 * 时间戳转时间
 */
function timestampToTime(timestamp: number) {
  return moment.unix(timestamp).format('HH:mm')
}

/**
 * 格式化series
 */
function formatterSeries(data: number[], color: string, label: string) {
  const { unit } = props

  const index = FILE_SIZE_UNITS.findIndex(v => unit.toUpperCase().startsWith(v))
  if (index >= 0)
    data = data.map(v => v ? Number(v) / 1024 ** index + 1 : v)

  return {
    type: 'line',
    symbol: 'none',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
        offset: 0,
        color: `${color}00`,
      },
      {
        offset: 1,
        color: `${color}28`,
      }]),
    },
    emphasis: {
      focus: 'series',
    },
    name: `${label}_${data[data.length - 1]}`,
    data,
  }
}

/**
 * 格式化图例
 */
function formatterLegend(data: any[]) {
  const formatter = function (label: string) {
    const name = data.find(i => i.name === label)?.label
    label = `${Number(label.split('_').pop()).toFixed(2)}${props.unit}`
    return `{text|${name}：}{num|${label}}`
  }

  return {
    data: data.map((item, index) => ({
      name: item.name,
      textStyle: {
        height: 28,
        padding: [0, 4],
        rich: {
          a: {
            verticalAlign: 'middle',
          },
          text: {
            color: '#292D36',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'PingFang',
          },
          num: {
            color: color[index % 2],
            fontSize: 28,
            fontWeight: 600,
            fontFamily: 'PingFang',
          },
        },
      },
    })),
    formatter,
  }
}
</script>

<template>
  <div p6 flex="~ col">
    <h4 v-text="title" />
    <client-only>
      <VChart
        :option="options"
        autoresize
        :h="title.includes('网卡') ? 62 : 43"
      />
    </client-only>
  </div>
</template>
