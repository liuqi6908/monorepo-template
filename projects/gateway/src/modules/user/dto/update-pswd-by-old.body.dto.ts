import { Decorator } from 'src/dto/password.dto'
import type { IUpdatePasswordByOldBodyDto } from 'zjf-types'

export class UpdatePasswordByOldBodyDto implements IUpdatePasswordByOldBodyDto {
  @Decorator(false)
  newPassword: string

  @Decorator(true)
  oldPassword?: string
}
