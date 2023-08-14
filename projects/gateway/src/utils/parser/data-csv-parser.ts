import type { DataDirectory } from 'src/entities/data-directory'
import type { DataField } from 'src/entities/data-field'
import { md5 } from '../encrypt/md5'

/**
 * 解析中间表，生成树结构与字段说明
 * @param arr
 */
export function dataCsvParser(arr: Array<{
  DATABASE_ENG: string
  DATABASE: string
  B_DATABASE_ENG: string
  B_DATABASE: string
  PART_ENG: string
  PART: string
  TABLE_ENG: string
  TABLE: string
  VARIABLE_ENG: string
  VARIABLE: string
  DESCRIPTION: string
  ORDER_COLUMN: string
}>, rootId: string) {
  const databases = {}

  const nodes: DataDirectory[] = []
  const fields: DataField[] = []

  arr.forEach((el) => {
    const {
      DATABASE_ENG,
      DATABASE,
      B_DATABASE_ENG,
      B_DATABASE,
      PART_ENG,
      PART,
      TABLE_ENG,
      TABLE,
      VARIABLE_ENG,
      VARIABLE,
      DESCRIPTION,
      ORDER_COLUMN,
    } = el

    if (!databases[DATABASE_ENG]) {
      const id = md5(DATABASE_ENG)
      databases[DATABASE_ENG] = { id }
      nodes.push({
        id,
        nameEN: DATABASE_ENG,
        nameZH: DATABASE,
        level: 1,
        order: Number(ORDER_COLUMN),
        parentId: rootId,
        rootId,
      })
    }

    const bDatabase = databases[DATABASE_ENG]

    if (!bDatabase[B_DATABASE_ENG]) {
      const id = md5(DATABASE_ENG + B_DATABASE_ENG)
      bDatabase[B_DATABASE_ENG] = { id }
      nodes.push({
        id,
        nameEN: B_DATABASE_ENG,
        nameZH: B_DATABASE,
        level: 2,
        order: Number(ORDER_COLUMN),
        parentId: databases[DATABASE_ENG].id,
        rootId,
      })
    }

    const part = bDatabase[B_DATABASE_ENG]

    if (!part[PART_ENG]) {
      const id = md5(DATABASE_ENG + B_DATABASE_ENG + PART_ENG)
      part[PART_ENG] = { id }
      nodes.push({
        id,
        nameEN: PART_ENG,
        nameZH: PART,
        level: 3,
        order: Number(ORDER_COLUMN),
        parentId: bDatabase[B_DATABASE_ENG].id,
        rootId,
      })
    }

    const table = part[PART_ENG]

    if (!table[TABLE_ENG]) {
      const id = md5(DATABASE_ENG + B_DATABASE_ENG + PART_ENG + TABLE_ENG)

      table[TABLE_ENG] = { id }
      nodes.push({
        id,
        nameEN: TABLE_ENG,
        nameZH: TABLE,
        level: 4,
        order: Number(ORDER_COLUMN),
        parentId: part[PART_ENG].id,
        rootId,
      })
    }

    fields.push({
      id: md5(TABLE_ENG + VARIABLE_ENG),
      description: DESCRIPTION,
      directoryId: table[TABLE_ENG].id,
      nameEN: VARIABLE_ENG,
      nameZH: VARIABLE,
    })
  })

  return { nodes, fields }
}
