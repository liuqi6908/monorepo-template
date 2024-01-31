<script lang="ts" setup>
import type { IDataDirectory } from 'zjf-types'

interface Props {
  modelValue?: IDataDirectory[]
  label: string
  readonly?: boolean
}

const props = defineProps<Props>()
defineEmits(['update:modelValue'])

const { dataList } = useDataRoot()

/** 角色权限 */
const value = useVModel(props, 'modelValue')
const permission = computed(() => value.value?.map(v => v.id))
/** 当前选中的数据资源 */
const selectData = ref<Partial<IDataDirectory>[]>([])

watch(
  dataList,
  (newVal) => {
    selectData.value = [{
      children: newVal,
    }]
  },
  {
    immediate: true,
  }
)

/**
 * 判断角色权限是否包含该数据资源
 */
function hasPermission(data?: IDataDirectory[]): boolean | undefined {
  return data?.some((item) => {
    if (permission.value?.includes(item.id))
      return true
    else if (item.children?.length)
      return hasPermission(item.children)
  })
}

/**
 * 选中数据资源
 */
function handleSelect(flag: boolean | null, item: IDataDirectory) {
  if (flag || flag === null) {
    value.value?.push(item)
  }
  else {
    const index = value.value?.findIndex(v => v.id === item.id)
    if (typeof index === 'number' && index !== -1)
      value.value?.splice(index, 1)
  }
}
</script>

<template>
  <div flex="~ col gap4">
    <div font-600 v-text="label" />
    <q-scroll-area h46>
      <div flex h46>
        <q-scroll-area
          v-for="(data, i) in selectData"
          :key="i" h46
          class="permission-list"
        >
          <div pr4 flex="~ col gap2">
            <div
              v-for="item in data.children"
              :key="item.id"
              flex="~ items-center justify-between gap10"
              p="r2 y3px" rounded-6px
              hover:bg-grey-3 cursor-default
              @click="() => {
                selectData.splice(i + 1, selectData.length - i)
                if (item.level !== 4 && item.children?.length)
                  selectData.push(item)
              }"
            >
              <div flex="~ items-center">
                <q-checkbox
                  :model-value="
                    permission?.includes(item.id)
                    || (hasPermission(item.children) ? null : false)
                  "
                  :disable="readonly"
                  toggle-indeterminate
                  @update:model-value="val => handleSelect(val, item)"
                />
                <div
                  text-sm font-500
                  :text="item.id === selectData[i + 1]?.id ? 'primary-1' : 'grey-8'"
                  whitespace-nowrap
                  v-text="item.nameZH"
                />
              </div>
              <div
                v-if="item.level !== 4 && item.children?.length"
                i-mingcute:right-line
                w4 h4
                :text="item.id === selectData[i + 1]?.id ? 'primary-1' : 'grey-8'"
              />
            </div>
          </div>
        </q-scroll-area>
      </div>
    </q-scroll-area>
    <div
      text-sm font-500
      flex="~ items-center wrap"
      gap="x4 y2"
    >
      <div>已选择：</div>
      <div
        v-for="(item, index) in value"
        :key="item.id" p2 rounded-2
        bg-grey-3 max-w-full
        flex="~ items-center gap1"
      >
        <div
          :style="{
            maxWidth: !readonly ? 'calc(100% - 20px)' : '100%'
          }"
          truncate
          v-text="item.nameZH"
        />
        <div
          v-if="!readonly"
          i-mingcute:close-circle-fill
          w4 h4 cursor-pointer
          bg-grey-4 hover:bg-grey-5
          @click="value?.splice(index, 1)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.permission-list {
  contain: none;

  :deep(.q-scrollarea__content) {
    position: inherit;

    .q-checkbox {
      .q-checkbox__inner {
        font-size: 34px;

        .q-checkbox__bg {
          width: 18px;
          height: 18px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
</style>
