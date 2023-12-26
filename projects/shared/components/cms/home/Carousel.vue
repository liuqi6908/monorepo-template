<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CmsJson } from '../../../types/cms.interface'

const props = defineProps<{
  list?: CmsJson[]
}>()

/** 当前轮播页索引 */
const index = ref(0)
/** 是否自动轮播 */
const autoplay = ref(false)

watch(
  () => props.list,
  () => {
    if (props.list?.length)
      index.value = 0
  },
  {
    immediate: true
  },
)
</script>

<template>
  <q-carousel
    v-model="index"
    class="home-carousel"
    navigation arrows animated infinite
    height="400px" :autoplay="autoplay"
    @mouseenter="autoplay = false"
    @mouseleave="autoplay = false"
  >
    <q-carousel-slide
      v-for="(item, index) in list"
      :key="index"
      :name="index"
      :img-src="item.img"
    >
      <div flex-center w-limited-1 h-full max-w-180 text="center grey-1">
        <div flex="~ col gap6">
          <h2 v-text="item.title" />
          <div v-if="item.richText" text-sm font-400 v-html="item.richText" />
        </div>
      </div>
    </q-carousel-slide>
    <template #navigation-icon="{ active, onClick }">
      <div
        rounded-full w3 h3 mx2 cursor-pointer
        b="1px grey-1" :bg="active ? 'grey-1' : 'transparent'"
        @click="onClick"
      />
    </template>
  </q-carousel>
</template>

<style lang="scss">
.home-carousel {
  .q-carousel__arrow {
    opacity: 0;
    transition: opacity .3s;
    .q-btn {
      .q-icon {
        color: var(--white-5);
      }
    }
  }

  &:hover .q-carousel__arrow {
    opacity: 1;
  }

  .q-carousel__navigation--bottom {
    bottom: 40px;
  }
}
</style>