import ECharts from 'vue-echarts'
import 'echarts'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app, isClient }) => {
  if (!isClient)
    return
  app.component('VChart', ECharts)
}
