<script lang="ts" setup>
import { Notify } from 'quasar'
import { PermissionType, SysConfig } from 'zjf-types'

const emits = defineEmits(['loading'])

const { adminRole } = useUser()
const { desktop, getDesktopConfig } = useSysConfig()

/** 是否可以编辑 */
const isEdit = computed(() => adminRole.value?.includes(PermissionType.CONFIG_UPSERT_DESKTOP))

/** 编辑云桌面配置对话框 */
const dialog = ref(false)
/** 云桌面限额 */
const quota = ref<number>()

/** 禁用提交 */
const disable = computed(() => !quota.value || quota.value <= 0)

onBeforeMount(getDesktopConfig)

/**
 * 更新
 */
async function update() {
  if (disable.value)
    return

  emits('loading', true)
  try {
    await upsertConfigApi({
      version: SysConfig.DESKTOP,
      desktop: {
        max: quota.value,
      }
    })
    Notify.create({
      type: 'success',
      message: '修改成功',
    })

    if (desktop.value)
      desktop.value.max = quota.value
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
          quota = desktop?.max
        }
      }"
    >
      云桌面限额：{{ desktop?.max }} 台
    </div>

    <ZDialog
      v-model="dialog"
      title="云桌面配置"
      :disable-confirm="disable"
      footer
      confirm-text="保存"
      @ok="update"
    >
      <ZInput
        label="云桌面配额"
        :model-value="quota"
        type="number" required
        @update:model-value="(val) => {
          const num = Math.floor(Number.parseFloat(val))
          if (Number.isNaN(num) || num <= 0)
            quota = 1
          else if (num > 99999)
            quota = 99999
          else
            quota = num
        }"
      />
    </ZDialog>
  </div>
</template>
