<script lang="ts" setup>
import Draggable from 'vuedraggable'

interface ListProps {
  modelValue?: any
  list?: any[]
  labelText?: string
  defaultLabel?: string
  valueText?: string
  isEdit?: boolean
}

const props = withDefaults(defineProps<ListProps>(), {
  labelText: 'label',
  defaultLabel: '未命名标题',
  valueText: 'value',
})
const emits = defineEmits(['update:modelValue', 'update:list'])

const { modelValue, list } = useVModels(props, emits)
const { byAbsolute } = usePosition()

/** 当前激活菜单 */
const active = ref<string>()

watch(
  () => props.list,
  () => {
    active.value = undefined
  },
  {
    immediate: true,
    deep: true,
  }
)

/**
 * 更改菜单状态
 */
function changeMenuState(id: string, state: boolean) {
  if (state)
    active.value = id
  else
    active.value = undefined
}
</script>

<template>
  <Draggable
    v-model="list"
    class="flex flex-col gap0.5"
    :item-key="valueText"
    :disabled="!isEdit"
    animation="300"
    chosenClass="chosen-item"
    dragClass="drag-item"
    filter=".edit-item"
  >
    <template #item="{ element, index }">
      <div
        :class="{
          active: modelValue?.[valueText] === element[valueText]
        }"
        :cursor="isEdit ? 'move' : 'default'"
        px2 rounded-2 h12 w-full
        hover:bg-grey-2 flex="~ justify-between items-center gap2"
        @click="() => {
          if (modelValue?.[valueText] === element[valueText])
            modelValue = undefined
          else
            modelValue = element
        }"
      >
        <div
          truncate text-sm font-500
          v-text="element[labelText] || defaultLabel"
        />
        <div
          v-if="isEdit"
          class="edit-item" w6 h6 flex-center
          cursor-pointer rounded-1
          hover="bg-black/10"
          @click.stop
        >
          <div i-mingcute:more-2-fill text-grey-5 />
          <q-menu
            :model-value="active === element[valueText]"
            class="more-menu"
            :id="`cms-more-menu-${element[valueText]}`"
            @update:model-value="val => changeMenuState(element[valueText], val)"
            @before-show="byAbsolute(`cms-more-menu-${element[valueText]}`, [-40, 4])"
          >
            <slot :item="element" :index="index" />
          </q-menu>
        </div>
      </div>
    </template>
  </Draggable>
</template>

<style lang="scss" scoped>
.active {
  background-color: var(--primary-1-bg);

  > div:first-child {
    color: var(--primary-1);
  }
}

.drag-item, .chosen-item {
  box-shadow: 0px 0px 8px 0px #00000014;
}
</style>
