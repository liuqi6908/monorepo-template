<script lang="ts" setup>
import { Notify } from 'quasar'
import { PermissionType, SysConfig, DESKTOP_FTP_QUOTA } from 'zjf-types'
import { fileSizeToBytes, formatFileSize, FILE_SIZE_UNITS } from 'zjf-utils'

const emits = defineEmits(['loading'])

const { adminRole } = useUser()
const { desktopFtp, getDesktopFtpConfig } = useSysConfig()

/** 是否可以编辑 */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.CONFIG_UPSERT_DESKTOP_FTP))

/** 编辑FTP配置对话框 */
const dialog = ref(false)
/** 全局配额 */
const quota = ref<number>()
/** 单位 */
const unit = ref<string>()

/** 禁用提交 */
const disable = computed(() => !quota.value || quota.value <= 0 || quota.value >= 1024 || !unit.value)

onBeforeMount(() => getDesktopFtpConfig(false))

/**
 * 更新
 */
async function update() {
  if (disable.value)
    return

  emits('loading', true)
  try {
    const value = Math.floor(fileSizeToBytes(`${quota.value} ${unit.value}`))

    await upsertConfigApi({
      version: SysConfig.DESKTOP_FTP,
      desktopFtp: {
        ftpQuota: value,
      }
    })
    Notify.create({
      type: 'success',
      message: '修改成功',
    })

    if (desktopFtp.value)
      desktopFtp.value.ftpQuota = value
  }
  finally {
    emits('loading', false)
  }
}
</script>

<template>
  <div>
    <div
      h10 flex="~ items-center" px4
      rounded-2 bg-grey-2 text-sm
      :cursor="isEdit ? 'pointer' : 'default'"
      select-none
      @click="() => {
        if (isEdit) {
          dialog = true
          const ftpQuota = formatFileSize(desktopFtp?.ftpQuota ?? DESKTOP_FTP_QUOTA)
          quota = Number(ftpQuota.split(' ')[0])
          unit = ftpQuota.split(' ')[1]
        }
      }"
    >
      全局配额：{{ formatFileSize(desktopFtp?.ftpQuota ?? DESKTOP_FTP_QUOTA) }}
    </div>

    <ZDialog
      v-model="dialog"
      title="用户数据上传配置"
      :disable-confirm="disable"
      footer
      confirm-text="保存"
      @ok="update"
    >
      <div flex="~ gap10">
        <ZInput
          v-model.number="quota"
          label="全局配额"
          type="number"
          required flex-1
        />
        <ZSelect
          v-model="unit"
          label="单位"
          :options="FILE_SIZE_UNITS.filter((_, i) => i < 4)"
          w26
        />
      </div>
    </ZDialog>
  </div>
</template>
