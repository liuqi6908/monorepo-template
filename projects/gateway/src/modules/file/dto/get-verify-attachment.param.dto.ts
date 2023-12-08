import { Mixin } from 'ts-mixer'
import { FilenameDto } from 'src/dto/filename.dto'
import { UserIdDto } from 'src/dto/id/user.dto'

export class GetVerifyAttachmentParamDto
  extends Mixin(UserIdDto, FilenameDto) {}
