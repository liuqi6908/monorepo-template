<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CmsJson } from '~/types'

const props = defineProps<{
  list?: CmsJson[]
}>()

/** 当前轮播页索引 */
const index = ref(0)
/** 是否自动轮播 */
const autoplay = ref(true)

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
    @mouseleave="autoplay = true"
  >
    <q-carousel-slide
      v-for="(item, index) in list"
      :key="index"
      :name="index"
      :img-src="item.img"
      p0
    >
      <div flex-center full text="center grey-1">
        <div max-w-150 flex="~ col gap-6" mb-12>
          <h2 v-text="item.title" />
          <div text-sm font-400 v-html="item.richText" />
        </div>
      </div>
    </q-carousel-slide>
    <template #navigation-icon="{ active, onClick }">
      <div
        rounded-full w3 h3 mx2
        border="1px grey-1" :bg="active ? 'grey-1' : 'transparent'"
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
    .q-icon {
      color: var(--white-5);
    }
    .q-carousel__prev-arrow--horizontal {
      left: 40px;
    }
    .q-carousel__next-arrow--horizontal {
      right: 40px;
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