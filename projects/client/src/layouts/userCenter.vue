<script lang="ts" setup>
import bg from '~/assets/bg/user.webp'
import HomeLayout from './home.vue'

const $route = useRoute()
const { nav } = useSysConfig()
const { height } = useAppHeader()

const value = computed(() => $route.path)
const dialog = ref(false)
</script>

<template>
  <HomeLayout layout>
    <Banner text-grey-1 :img="bg" :title="nav?.homeDesc" />
    <div pb20>
      <div w-limited-1 flex="~ gap4" sm="gap6" lg="gap8" xl="gap10">
        <div pt10 flex="~ col gap2">
          <ZMenu
            v-model="value"
            :list="
              USER_MENU_LIST.filter(v => v.userCenter && v.config !== false)
                .map(({ name, to }) => ({
                  id: to!,
                  label: name,
                  to,
                }))
            "
            class="sticky mb14"
            :style="{ top: `${height + 23}px` }"
          />
          <q-item
            active-class="bg-gray-2"
            clickable p="y2.5 x4" font-600 items-center
            mt-auto sticky bottom-4
            @click="dialog = true"
          >
            <div
              text-grey-8 truncate
            >
              退出登录
            </div>
          </q-item>
        </div>
        <RouterView pt10 flex-1 w0 />
      </div>
    </div>

    <LogoutDialog v-model="dialog" />
  </HomeLayout>
</template>
