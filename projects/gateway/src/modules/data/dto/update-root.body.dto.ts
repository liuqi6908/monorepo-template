import type { IUpdateRootBodyDto } from 'zjf-types'
import { CreateRootBodyDto } from './create-root.body.dto'

export class UpdateRootBodyDto
  extends CreateRootBodyDto
  implements IUpdateRootBodyDto {}
