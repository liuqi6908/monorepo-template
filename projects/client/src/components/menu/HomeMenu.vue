<script lang="ts" setup>
const $route = useRoute()
const $router = useRouter()
const { nav, getNavConfig } = useSysConfig()

const value = computed({
  get() {
    return $route.path
  },
  set(newVal) {
    if ($route.path !== newVal)
      $router.push(newVal)
  }
})

/** 导航栏列表 */
const navList = computed(() => [
  {
    name: nav.value?.homeLabel,
    to: '/home',
  },
  {
    name: nav.value?.databaseLabel,
    to: '/database',
  },
  {
    name: nav.value?.questionLabel,
    to: '/question',
  },
  {
    name: nav.value?.requestLabel,
    to: '/request',
  },
])

onBeforeMount(getNavConfig)
</script>

<template>
  <div flex="~ justify-center" b-b="1px grey-3">
    <q-tabs class="client-menu" v-model="value" max-w-full>
      <q-tab
        v-for="item in navList"
        :key="item.to"
        :name="item.to"
        px8 opacity100
      >
        <div text-base font-600 max-w-full truncate v-text="item.name" />
      </q-tab>
    </q-tabs>
  </div>
</template>

<style lang="scss" scoped>
.client-menu {
  :deep(.q-tabs__content) {
    flex-wrap: wrap;
    justify-content: center;

    .q-tab {
      flex: none;
      max-width: 100%;

      .q-tab__content {
        min-width: auto;
        max-width: 100%;
      }

      .q-tab__indicator {
        padding: 0 32px;
        background: none;
        height: 4px;
        &::after {
          display: block;
          content: '';
          width: 100%;
          height: 100%;
          background: var(--secondary-1);
        }
      }
    }
  }
}
</style>
