<script setup lang="ts">
</script>

<template>
  <div flex="~ col gap1">
    <RouterLink
      v-for="item in ADMIN_MENU_LIST"
      :key="item.to"
      :to="item.to"
    >
      <MenuItem
        :label="item.name"
        :icon="item.to.substring(1)"
        :active="$route.path === item.to"
      />
    </RouterLink>
  </div>
</template>
