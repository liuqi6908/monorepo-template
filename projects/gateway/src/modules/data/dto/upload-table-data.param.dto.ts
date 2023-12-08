import { Mixin } from 'ts-mixer'
import type { IUploadTableDataParamDto } from 'zjf-types'
import { UploadTypeDto } from 'src/dto/upload-type.dto'
import { DataRootIdDto } from 'src/dto/id/data-root.dto'
import { FilenameDto } from 'src/dto/filename.dto'

export class UploadTableDataParamDto
  extends Mixin(UploadTypeDto, DataRootIdDto, FilenameDto)
  implements IUploadTableDataParamDto {}
