import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import type { IBatchUpdateUserDataRoleBodyDto } from 'zjf-types'
import { UserIdDto } from 'src/dto/id/user.dto'
import { DataRoleIdOptionalDto } from 'src/dto/id/data-role.dto'

export class BatchUpdateUserDataRoleBodyDto
  extends DataRoleIdOptionalDto
  implements IBatchUpdateUserDataRoleBodyDto {
    @ApiProperty({
      description: '用户id',
      type: [String]
    })
    @IsString({ each: true })
    id: UserIdDto['userId'][]
  }
