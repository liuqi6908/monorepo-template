<script lang="ts" setup>
import { Notify, copyToClipboard } from 'quasar'
import { DesktopStatus } from 'zjf-types'
import { validatePassword } from 'zjf-utils'

const emits = defineEmits(['loading'])

const { desktopInfo, vmInfo, getVmInfo } = useDesktop()
const { pause, resume } = useIntervalFn(async () => {
  try {
    await getVmInfo()
  }
  catch (_) {
    pause()
  }
  finally {
    const status = vmInfo.value?.state
    if (status === DesktopStatus.RUNNING || status === DesktopStatus.STOPPED)
      pause()
  }
}, 5000, { immediate: false })

/** 是否可以使用云桌面开关机功能 */
const desktopOnOff = computed(() => getEnvVariable('VITE_DESKTOP_ON_OFF'))
/** 倒计时 */
const countDown = computed(() => {
  const endTime = desktopInfo.value?.expiredAt
  if (!endTime)
    return 0
  else
    return Math.floor((new Date(endTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
})
/** 云桌面信息 */
const desktopTable = computed(() => [
  { label: '云桌面访问地址', value: desktopInfo.value?.accessUrl },
  { label: '云桌面账号', value: `${import.meta.env.VITE_DC_PREFIX}${desktopInfo.value?.account}` },
  { label: '云桌面密码', value: desktopInfo.value?.password },
])
/** 隐藏密码 */
const hidePassword = ref(false)

/** 输入用户密码对话框 */
const passwordDialog = ref(false)
/** 用户登录密码 */
const password = ref('')

/** 虚拟机状态 */
const vmStatus = computed(() => vmInfo.value?.state)

/**
 * 操作虚拟机
 */
async function operateVM(type: '开机' | '关机' | '重启') {
  const id = desktopInfo.value?.id
  if (!id)
    return
  emits('loading', true)
  try {
    if (type === '开机')
      await startVMApi(id)
    else if (type === '关机')
      await stopVMApi(id)
    else if (type === '重启')
      await rebootVMApi(id)
    Notify.create({
      message: `云桌面正在${type}中`,
      type: 'success',
    })
    await getVmInfo()
    resume()
  }
  finally {
    emits('loading', false)
  }
}

/**
 * 复制文本
 */
function copyText(text: string) {
  copyToClipboard(text)
    .then(() => {
      Notify.create({
        message: '已复制到剪切板',
        type: 'success',
      })
    })
    .catch(() => {
      Notify.create({
        message: '复制失败',
        type: 'danger',
      })
    })
}

/**
 * 查看云桌面密码
 */
async function viewDesktopPassword() {
  if (!desktopInfo.value)
    return
  if (!password.value)
    return passwordDialog.value = true

  emits('loading', true)
  try {
    desktopInfo.value.password = await queryDesktopPasswordApi(
      desktopInfo.value.id,
      {
        password: rsaEncrypt(import.meta.env.VITE_PUBLIC_KEY ?? '', password.value),
      }
    )
  }
  catch (_) {
    password.value = ''
  }
  finally {
    emits('loading', false)
  }
}
</script>

<template>
  <div flex="~ col gap6">
    <div flex="~ justify-between wrap gap6">
      <div h12 px6 b="1px primary-1" flex="~ items-center gap2" font-600>
        状态：
        <div flex="~ items-center gap1">
          <div i-material-symbols:check-circle w6 h6 text-alerts-success />
          使用中（倒计时{{ countDown }}天）
        </div>
      </div>
      <div v-if="desktopOnOff" flex="~ gap4">
        <ZBtn
          label="开机"
          size="big"
          :disable="vmStatus !== DesktopStatus.STOPPED"
          @click="operateVM('开机')"
        >
          <template #icon>
            <div text-xl i-material-symbols:power-settings-new />
          </template>
        </ZBtn>
        <ZBtn
          label="重启"
          size="big"
          :disable="vmStatus !== DesktopStatus.RUNNING"
          @click="operateVM('重启')"
        >
          <template #icon>
            <div text-xl i-material-symbols:sync />
          </template>
        </ZBtn>
        <ZBtn
          label="关机"
          size="big"
          :disable="vmStatus !== DesktopStatus.RUNNING"
          @click="operateVM('关机')"
        >
          <template #icon>
            <div text-xl i-material-symbols:power-settings-new />
          </template>
        </ZBtn>
      </div>
    </div>
    <div flex="~ col" b="1px grey-3" lg="flex-row">
      <div
        v-for="(item, index) in desktopTable"
        :key="index"
        flex="~ 1 col"
        b-grey-3 b-b-1px
        lg="b-b-none b-r-1px w0"
        :style="{
          border: index < desktopTable.length - 1 ? '' : 'none'
        }"
      >
        <div bg-grey-2 p="y3 x6" v-text="item.label" />
        <div flex="~ justify-between items-center" p="y3 x6">
          <a
            v-if="item.label === '云桌面访问地址'"
            text-grey-8
            target="_blank"
            :href="item.value"
            truncate
            v-text="item.value"
          />
          <div
            v-else-if="item.label === '云桌面账号'"
            truncate flex-1 w0
            v-text="item.value"
          />
          <div
            v-else-if="item.label === '云桌面密码'"
            flex-1 w0
          >
            <div
              v-if="(typeof item.value !== 'undefined')"
              truncate
              v-text="hidePassword ? '********' : item.value"
            />
            <TextBtn
              v-else
              label="查看密码"
              text="base!"
              :disable="!desktopInfo"
              @click="viewDesktopPassword"
            />
          </div>
          <div
            v-if="item.label !== '云桌面密码' || (typeof item.value !== 'undefined' && item.value !== '您的登录密码')"
            text-grey-4 flex="~ gap4"
          >
            <div
              v-if="item.label === '云桌面密码'"
              :class="hidePassword ? 'i-material-symbols:visibility-off-outline' : 'i-material-symbols:visibility-outline' "
              cursor-pointer text-xl
              @click="hidePassword = !hidePassword"
            />
            <div
              i-material-symbols:content-copy-outline-sharp
              cursor-pointer text-xl
              @click="copyText(item.value || '')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 输入用户登录密码 -->
    <ZDialog
      v-model="passwordDialog"
      title="用户密码"
      footer
      :disable-confirm="!!validatePassword(password)"
      @ok="viewDesktopPassword"
    >
      <ZInput
        v-model="password"
        label="密码"
        placeholder="请输入用户密码"
        password required
        :params="{
          rules: [
            (val: string) => validatePassword(val) || true,
          ]
        }"
      />
    </ZDialog>
  </div>
</template>

<style lang="scss" scoped>
.z-btn.disabled {
  opacity: 1 !important;

  &::before {
    background-color: var(--grey-4);
  }
}
</style>
