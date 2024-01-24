<script setup lang="ts">
import { QTable } from 'quasar'
import type { QTableProps, QTableSlots } from 'quasar'
import { ROWS_PER_PAGE_OPTIONS } from 'zjf-types'

interface ZTableProps {
  rows: QTableProps['rows']
  cols: QTableProps['columns']
  loading?: boolean
  selected?: any[]
  pagination?: QTableProps['pagination']
  onRequest?: QTableProps['onRequest']
  params?: Omit<QTableProps, 'rows' | 'columns' | 'loading' | 'selected' | 'pagination' | 'onRequest'>
}

const props = defineProps<ZTableProps>()
const emits = defineEmits(['update:selected', 'update:pagination'])

const { selected, pagination } = useVModels(props, emits)

const tableRef = ref<InstanceType<typeof QTable>>()

onMounted(() => {
  if (props.onRequest)
    tableRef.value?.requestServerInteraction()
})
</script>

<template>
  <q-table
    class="z-table"
    ref="tableRef"
    v-model:selected="selected"
    v-model:pagination="pagination"
    :rows="rows"
    :columns="cols"
    :loading="loading"
    :rows-per-page-options="ROWS_PER_PAGE_OPTIONS"
    virtual-scroll
    v-bind="params" flat full
    bg-grey-1 rounded-3 b="1px grey-3"
    @request="onRequest"
  >
    <template
      v-for="(_, slotName) of ($slots as Readonly<QTableSlots>)"
      :key="slotName"
      #[slotName]="props"
    >
      <slot :name="slotName" v-bind="props as any" />
    </template>
    /* <template #cell>
      1
    </template> */
    <template #loading>
      <ZLoading :value="loading" />
    </template>
  </q-table>
</template>

<style lang="scss" scoped>
.z-table {
  :deep() {
    .q-table__middle {
      thead {
        background: var(--grey-2);
        position: sticky;
        top: 0;
        z-index: 1;
      }

      tr {
        height: 48px;

        th, td {
          height: auto;
          padding: 8px 16px;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: var(--grey-8);
          border-color: var(--grey-3);
          background: transparent;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        th {
          font-weight: 500;
        }
      }

      .q-checkbox .q-checkbox__inner {
        font-size: 36px;
      }
    }

    .q-table__top {
      background: var(--grey-2);
      border-bottom: 1px solid var(--grey-3);
    }

    .q-table__bottom {
      min-height: 40px;
      height: 40px;
      padding: 0 16px;
      color: var(--grey-8);
      font-size: 16px;

      .q-table__bottom-nodata-icon {
        font-size: 18px;
      }

      .q-table__control {
        .q-btn, .q-field__append {
          i {
            font-size: 16px;
          }
        }

        .q-field__append i {
          bottom: 1px;
        }
      }
    }
  }
}
</style>
