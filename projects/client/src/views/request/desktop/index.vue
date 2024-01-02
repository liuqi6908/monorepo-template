<script lang="ts" setup>
import type { VMOverview, DesktopHost } from 'shared/types/desktop.interface'
import img from '~/assets/desktop/cloudHost.png'
import HostPercent from './HostPercent.vue'
import HostTiming from './HostTiming.vue'

/** 云桌面总览 */
const vmInfo = ref<VMOverview>()
/** 云桌面物理机列表 */
const hostList = ref<DesktopHost[]>()
/** 选择的当前物理机 */
const model = ref<string>()

onBeforeMount(async () => {
  vmInfo.value = await getVMOverviewApi()
  hostList.value = await getHostListApi()
  if (hostList.value?.length)
    model.value = hostList.value[0].uuid
})
</script>

<template>
  <div bg-grey-2 p="t10 b20">
    <div w-limited-1 flex="~ col gap10">
      <div p6 flex="~ col gap6" bg-grey-1>
        <h4>云主机情况</h4>
        <div flex="~ justify-between items-center wrap gap6">
          <div flex="~ items-center gap13" p="l10 r5" xl="pl29" m-auto>
            <img :src="img" w53 h50 />
            <div
              p6 flex="col center gap4" w34 h34
              style="background: linear-gradient(135deg, #F5F7FA 0%, rgba(245, 247, 250, 0) 100%)"
            >
              <h2 text-primary-1 v-text="vmInfo?.total ?? 0" />
              <div text="base grey-5" font-600>总数量</div>
            </div>
          </div>
          <div
            font-600 text-center b="1px grey-3"
            flex m-auto
          >
            <div b-r="1px grey-3" w60 xl="w66.5">
              <div bg-grey-2 h17 flex-center>
                运行中
              </div>
              <div text-lg h17 flex-center v-text="vmInfo?.running ?? 0" />
            </div>
            <div w60 xl="w66.5">
              <div bg-grey-2 h17 flex-center>
                停止
              </div>
              <div text-lg h17 flex-center v-text="vmInfo?.stopped ?? 0" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="hostList?.length" p="y10 x6" flex="~ col gap10" bg-grey-1>
        <ZBtnToggle
          v-model="model"
          :options="hostList.map((v, i) => ({ label: `主机${i + 1}`, value: v.uuid }))"
        />
        <HostPercent :uuid="model" :key="model" />
        <HostTiming :uuid="model" :key="model" />
      </div>
    </div>
  </div>
</template>
