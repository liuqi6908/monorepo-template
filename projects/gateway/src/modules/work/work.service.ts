import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ErrorCode, MinioBucket } from 'zjf-types'

import { Work } from 'src/entities/work'
import type { User } from 'src/entities/user'
import { responseError } from 'src/utils/response'
import { FileService } from '../file/file.service'
import { timestampFilename } from '../../utils/timestamp-filename'

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private readonly _workRepo: Repository<Work>,
    private readonly _fileSrv: FileService,
  ) {}

  public async upload({ user, file, title, author, filename }: {
    user: User
    file: any
    title: string
    author: string
    filename: string
  }) {
    const uniqueFilename = timestampFilename(filename)
    const path = `work/${user.id}/${uniqueFilename}`
    const work = this._workRepo.create({
      userId: user.id,
      filename: uniqueFilename,
      title,
      author,
    })
    await this._fileSrv.upload(MinioBucket.PRIVATE, path, file)
    await this._workRepo.save(work)
    return work
  }

  public async download(id: string) {
    const record = await this._workRepo.findOne({ where: { id } })
    if (!record)
      responseError(ErrorCode.FILE_NOT_FOUND)
    const path = `work/${record.userId}/${record.filename}`
    return {
      stream: await this._fileSrv.download(MinioBucket.PRIVATE, path),
      filename: record.filename,
    }
  }

  public async delete(record) {
    const path = `work/${record.userId}/${record.filename}`
    await this._fileSrv.delete(MinioBucket.PRIVATE, path)
    const deleteRes = await this._workRepo.delete({ id: record.id })
    return deleteRes.affected > 0
  }

  public async update({ record, file, title, author, filename }: {
    record: Work
    file: any
    title: string
    author: string
    filename: string
  }) {
    if (title)
      record.title = title
    if (author)
      record.author = author
    if (file) {
      const oldFilename = record.filename
      await this._fileSrv.delete(MinioBucket.PRIVATE, `work/${record.userId}/${oldFilename}`)
      const newFilename = timestampFilename(filename)
      const path = `work/${record.userId}/${newFilename}`
      await this._fileSrv.upload(MinioBucket.PRIVATE, path, file)
      record.filename = newFilename
    }
    return await this._workRepo.save(record)
  }

  repo() {
    return this._workRepo
  }
}
