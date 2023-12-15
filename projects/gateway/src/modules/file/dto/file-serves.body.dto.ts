import { Mixin } from 'ts-mixer'
import type { IFileServesBodyDto } from 'zjf-types'
import { FilePathDto } from 'src/dto/file-path.dto'
import { BucketDto } from 'src/dto/bucket.dto'

export class FileServesBodyDto
  extends Mixin(
    FilePathDto,
    BucketDto,
  )
  implements IFileServesBodyDto {}
