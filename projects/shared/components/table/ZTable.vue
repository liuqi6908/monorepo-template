<script setup lang="ts">
import type { QTableProps } from 'quasar'
import { QTableSlots } from 'quasar'
import { PAGINATION_SIZE_DFT, ROWS_PER_PAGE_OPTIONS } from 'zjf-types'
import ZLoading from '../loading/ZLoading.vue'

interface ZTableProps {
  rows: QTableProps['rows']
  cols: QTableProps['columns']
  loading?: boolean
  /** 是否启用分页，禁用后，强制显示全部的数据 */
  disablePagination?: boolean
  params?: Omit<QTableProps, 'rows' | 'columns' | 'loading' | 'hideBottom'>
}

const { params } = defineProps<ZTableProps>()
</script>

<template>
  <q-table
    class="z-table"
    :rows="rows"
    :columns="cols"
    :loading="loading"
    :hide-bottom="disablePagination"
    separator="cell" flat square
    :pagination="{
      rowsPerPage: disablePagination ? 0 : PAGINATION_SIZE_DFT,
    }"
    :rows-per-page-options="ROWS_PER_PAGE_OPTIONS"
    bordered
    v-bind="params"
  >
    <template
      v-for="(_, slotName) of ($slots as Readonly<QTableSlots>)"
      :key="slotName"
      #[slotName]="props"
    >
      <slot :name="slotName" v-bind="props as any" />
    </template>
    <template #loading>
      <ZLoading :value="loading" />
    </template>
  </q-table>
</template>

<style lang="scss" scoped>
.z-table {
  :deep() {
    .q-table__top,
    thead tr:first-child th {
      background: var(--primary-1-7);
      color: #fff;
    }

    tr {
      min-height: 40px;
      height: auto;

      th, td {
        height: auto;
        padding: 8px 16px;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: var(--grey-8);
        border-color: var(--grey-3);
      }

      th {
        text-align: center;
      }
    }

    .q-table__bottom {
      min-height: 40px;
      height: 40px;
      padding: 0 16px;
      background: var(--grey-2);
      color: var(--grey-8);
      font-size: 16px;

      .q-table__bottom-nodata-icon {
        font-size: 18px;
      }

      .q-table__control {
        .q-btn i {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
