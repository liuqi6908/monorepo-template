import { Mixin } from 'ts-mixer'
import type { IUploadDataIntroParamDto } from 'zjf-types'
import { FilenameDto } from 'src/dto/filename.dto'
import { DataRootIdDto } from 'src/dto/id/data-root.dto'

export class UploadDataIntroParamDto
  extends Mixin(FilenameDto, DataRootIdDto)
  implements IUploadDataIntroParamDto {}
