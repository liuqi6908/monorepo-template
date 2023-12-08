import type { IGetProfileOwnQueryDto } from 'zjf-types'
import { RelationRawDto } from 'src/dto/relation.dto'

export class GetProfileOwnQueryDto
  extends RelationRawDto
  implements IGetProfileOwnQueryDto {}
