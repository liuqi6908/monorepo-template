<script lang="ts" setup>
const value = ref<string>()
</script>

<template>
  <div flex="~ justify-center" b-b="1px grey-3">
    <q-tabs class="client-menu" v-model="value">
      <q-route-tab
        v-for="item in CLIENT_MENU_LIST"
        :key="item.to"
        :to="item.to"
        px8 opacity100
      >
        <div text-base font-600 v-text="item.name" />
      </q-route-tab>
    </q-tabs>
  </div>
</template>

<style lang="scss">
.client-menu {
  .q-tab {
    .q-tab__content {
      min-width: auto;
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
        background: #F99E34;
      }
    }
  }
}
</style>
