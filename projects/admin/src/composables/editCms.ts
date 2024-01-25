import { cloneDeep } from 'lodash'
import { PermissionType } from 'zjf-types'
import { getRandomID, hasIntersection } from 'zjf-utils'
import type { CmsJson } from 'shared/types/cms.interface'

/** 加载中 */
const loading = ref(false)

/** 页面原始数据 */
const pageData = ref<CmsJson[]>([])
/** 可编辑数据 */
const editData = ref<CmsJson[]>([])

/** 添加组件 */
const addComponent = ref<number>()
/** 添加列表项 */
const addItem = ref<number>()

/** 当前选中的组件 */
const selectComponent = ref<CmsJson>()
/** 当前选中的列表项 */
const selectItem = ref<CmsJson>()

watch(
  selectComponent,
  (newVal) => {
    selectItem.value = newVal?.json?.[0] as CmsJson
  },
)

watch(
  addComponent,
  (newVal, oldVal) => {
    if (typeof oldVal === 'number') {
      if (!editData.value[oldVal]?.componentId)
        editData.value.splice(oldVal, 1)
    }
    if (typeof newVal === 'number') {
      selectItem.value = undefined
      const component: CmsJson = {
        id: getRandomID(),
      }
      editData.value.splice(newVal, 0, component)
      selectComponent.value = component
    }
  },
)

export function useEditCms() {
  const { adminRole } = useUser()
  const { getCms } = useCms()
  const { active } = useMenu()

  /**
   * 当前页面的配置
   */
  const pageConfig = computed(() => CMS_CONFIG.find(v => v.id === active.value))

  /**
   * 是否可以编辑
   */
  const isEdit = computed(() => hasIntersection(
    adminRole.value ?? [],
    [
      PermissionType.CMS_CREATE,
      PermissionType.CMS_UPDATE,
    ],
  ))

  /**
   * 当前组件的列表项参数
   */
  const componentParams = computed(() => {
    const { componentId } = selectComponent.value ?? {}
    if (!componentId)
      return
    return CMS_COMPONENTS[componentId]?.param
  })

  /**
   * 是否为列表项
   */
  const isItemList = computed(() => componentParams.value?.includes('list'))

  /**
   * 初始化页面内容
   */
  async function initPage() {
    addComponent.value = undefined
    addItem.value = undefined
    selectComponent.value = undefined
    selectItem.value = undefined

    const { id, component } = pageConfig.value ?? {}

    if (!id || !component)
      return

    loading.value = true
    try {
      pageData.value = await getCms(id) ?? []
      if (
        !pageData.value.length
        && component !== true
        && !CMS_COMPONENTS[component]?.param.includes('list')
      ) {
        pageData.value = [{
          id: getRandomID(),
        }]
      }
      editData.value = cloneDeep(pageData.value)
    }
    finally {
      if (component !== true) {
        selectComponent.value = {
          id,
          componentId: component,
          json: editData.value,
        }
      }
      else if (editData.value.length) {
        selectComponent.value = editData.value[0]
      }
      loading.value = false
    }
  }

  return {
    loading,
    pageData,
    editData,
    addComponent,
    addItem,
    selectComponent,
    selectItem,
    pageConfig,
    isEdit,
    isItemList,
    componentParams,
    initPage,
  }
}
