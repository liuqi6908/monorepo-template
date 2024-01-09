<script lang="ts" setup>
import bg from '~/assets/bg/user.webp'
import HomeLayout from './home.vue'

const $route = useRoute()
const { nav } = useSysConfig()
const { height } = useAppHeader()

const value = computed(() => $route.path)
</script>

<template>
  <HomeLayout layout>
    <Banner text-grey-1 :img="bg" :title="nav?.homeDesc" />
    <div pb20>
      <div w-limited-1 flex="~ gap4" sm="gap6" lg="gap8" xl="gap10">
        <div pt10>
          <ZMenu
            v-model="value"
            :list="USER_MENU_LIST.filter(v => v.userCenter).map(({ name, to }) => ({
              id: to!,
              label: name,
              to,
            }))"
            sticky
            :style="{ top: `${height + 23}px` }"
          />
        </div>
        <RouterView pt10 flex-1 w0 />
      </div>
    </div>
  </HomeLayout>
</template>
