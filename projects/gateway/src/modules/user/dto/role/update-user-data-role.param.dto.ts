import { Mixin } from 'ts-mixer'
import { UserIdDto } from 'src/dto/id/user.dto'
import { DataRoleIdOptionalDto } from 'src/dto/id/data-role.dto'

export class UpdateUserDataRoleParamDto extends
  Mixin(
    UserIdDto,
    DataRoleIdOptionalDto,
  ) {}
