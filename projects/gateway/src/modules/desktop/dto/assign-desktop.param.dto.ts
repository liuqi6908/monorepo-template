import { Mixin } from 'ts-mixer'
import { UserIdDto } from 'src/dto/id/user.dto'
import { DesktopIdDto } from 'src/dto/id/desktop.dto'

export class AssignDesktopParamDto
  extends Mixin(
    DesktopIdDto,
    UserIdDto,
  ) {}
