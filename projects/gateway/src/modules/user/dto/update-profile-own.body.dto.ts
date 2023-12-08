import type { IUpdateProfileOwnBodyDto } from 'zjf-types'
import { NicknameOptionalDto } from 'src/dto/nickname.dto'

export class UpdateProfileOwnBodyDto
  extends NicknameOptionalDto
  implements IUpdateProfileOwnBodyDto {}
