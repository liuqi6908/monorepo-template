import { validateNameEn, validateNameZh } from 'zjf-utils'
import type { DataDirectory } from 'src/entities/data-directory'
import type { DataField } from 'src/entities/data-field'
import { md5 } from '../encrypt/md5'

/**
 * 解析中间表，生成树结构与字段说明
 */
export function dataCsvParser(arr: string[][], rootId: string, dynamic?: boolean) {
  const databases = {}

  const idMap = new Map()

  const nodes: DataDirectory[] = []
  const fields: DataField[] = []

  arr.forEach((el) => {
    let [
      DATABASE, DATABASE_ENG,
      B_DATABASE, B_DATABASE_ENG,
      PART, PART_ENG,
      TABLE, TABLE_ENG,
      VARIABLE, VARIABLE_ENG,
      DESCRIPTION = '', ORDER_COLUMN,
    ] = el
    const ORDER = Number(ORDER_COLUMN) || 1

    if (
      validateNameZh(DATABASE) || validateNameEn(DATABASE_ENG)
      || validateNameZh(TABLE) || validateNameEn(TABLE_ENG)
      || validateNameZh(VARIABLE) || validateNameEn(VARIABLE_ENG)
      || (!dynamic && (
        validateNameZh(B_DATABASE) || validateNameEn(B_DATABASE_ENG)
        || validateNameZh(PART) || validateNameEn(PART_ENG)
      ))
    )
      return

    if ((!B_DATABASE || !B_DATABASE_ENG) && PART && PART_ENG) {
      B_DATABASE = PART
      B_DATABASE_ENG = PART_ENG
      PART = PART_ENG = ''
    }

    const isBDatabase = !!B_DATABASE && !!B_DATABASE_ENG
    const isPart = !!PART && !!PART_ENG

    if (!databases[DATABASE_ENG]) {
      const id = md5(rootId + DATABASE_ENG)
      if (!idMap.has(id)) {
        idMap.set(id, true)
        databases[DATABASE_ENG] = { id }
        nodes.push({
          id,
          nameEN: DATABASE_ENG,
          nameZH: DATABASE,
          level: 1,
          order: ORDER,
          parentId: rootId,
          rootId,
          path: [rootId, id],
        })
      }
    }

    const bDatabase = databases[DATABASE_ENG]
    if (isBDatabase && !bDatabase[B_DATABASE_ENG]) {
      const id = md5(rootId + DATABASE_ENG + B_DATABASE_ENG)
      if (!idMap.has(id)) {
        idMap.set(id, true)
        bDatabase[B_DATABASE_ENG] = { id }
        nodes.push({
          id,
          nameEN: B_DATABASE_ENG,
          nameZH: B_DATABASE,
          level: 2,
          order: ORDER,
          parentId: databases[DATABASE_ENG].id,
          rootId,
          path: [rootId, databases[DATABASE_ENG].id, id],
        })
      }
    }

    const part = isBDatabase ? bDatabase[B_DATABASE_ENG] : databases[DATABASE]
    if (isPart && !part[PART_ENG]) {
      const id = md5(rootId + DATABASE_ENG + B_DATABASE_ENG + PART_ENG)
      if (!idMap.has(id)) {
        idMap.set(id, true)
        part[PART_ENG] = { id }
        nodes.push({
          id,
          nameEN: PART_ENG,
          nameZH: PART,
          level: 3,
          order: ORDER,
          parentId: bDatabase[B_DATABASE_ENG].id,
          rootId,
          path: [rootId, databases[DATABASE_ENG].id, bDatabase[B_DATABASE_ENG].id, id],
        })
      }
    }

    const table = isPart ? part[PART_ENG] : isBDatabase ? bDatabase[B_DATABASE_ENG] : databases[DATABASE_ENG]
    if (!table[TABLE_ENG]) {
      const id = md5(rootId + DATABASE_ENG + B_DATABASE_ENG + PART_ENG + TABLE_ENG)
      if (!idMap.has(id)) {
        idMap.set(id, true)
        table[TABLE_ENG] = { id }
        const path = [rootId, databases[DATABASE_ENG].id, id]
        if (isPart)
          path.splice(2, 0, part[PART_ENG].id)
        if (isBDatabase)
          path.splice(2, 0, bDatabase[B_DATABASE_ENG].id)
        nodes.push({
          id,
          nameEN: TABLE_ENG,
          nameZH: TABLE,
          level: 4,
          order: ORDER,
          parentId: isPart ? part[PART_ENG].id : isBDatabase ? part.id : bDatabase.id,
          rootId,
          path,
        })
      }
    }

    const fieldId = md5(rootId + TABLE_ENG + VARIABLE_ENG)
    if (!idMap.has(fieldId)) {
      idMap.set(fieldId, true)
      fields.push({
        id: fieldId,
        description: DESCRIPTION,
        directoryId: table[TABLE_ENG].id,
        nameEN: VARIABLE_ENG,
        nameZH: VARIABLE,
        order: ORDER,
      })
    }
  })

  nodes.sort((a, b) => a.level - b.level)

  return { nodes, fields }
}
