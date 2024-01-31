import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import type { IBatchUpdateUserRoleBodyDto } from 'zjf-types'
import { UserIdDto } from 'src/dto/id/user.dto'
import { RoleIdOptionalDto } from 'src/dto/id/role.dto'

export class BatchUpdateUserRoleBodyDto
  extends RoleIdOptionalDto
  implements IBatchUpdateUserRoleBodyDto {
    @ApiProperty({
      description: '用户id',
      type: [String]
    })
    @IsString({ each: true })
    id: UserIdDto['userId'][]
  }
