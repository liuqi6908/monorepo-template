import { Mixin } from 'ts-mixer'
import { UserIdDto } from 'src/dto/id/user.dto'
import { RoleIdOptionalDto } from 'src/dto/id/role.dto'

export class UpdateUserRoleParamDto
  extends Mixin(
    UserIdDto,
    RoleIdOptionalDto,
  ) {}
