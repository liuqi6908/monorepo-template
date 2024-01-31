import { Buffer } from 'node:buffer'
import * as Papa from 'papaparse'
import * as iconv from 'iconv-lite'
import { In, IsNull, Not } from 'typeorm'
import { objectPick } from '@catsjuice/utils'
import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { ErrorCode, LogDataAction, MinioBucket, PermissionType, UploadType } from 'zjf-types'
import { isUTF8 } from 'zjf-utils'
import type { FindOptionsWhere } from 'typeorm'

import { DataRootIdDto } from 'src/dto/id/data-root.dto'
import { DataDirectoryIdDto } from 'src/dto/id/data-directory.dto'
import { SuccessStringDto } from 'src/dto/success.dto'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import { DataDirectory } from 'src/entities/data-directory'
import { DataRoleCheck } from 'src/guards/data-role-permission.guard'
import { HasPermission } from 'src/guards/permission.guard'
import { batchSave } from 'src/utils/db/batch-save'
import { dataCsvParser } from 'src/utils/parser/data-csv-parser'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { ApiSuccessResponse, responseError } from 'src/utils/response'
import { createDataDirectoryTree } from 'src/utils/data-directory-tree'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'

import { FileService } from '../file/file.service'
import { DataService } from './data.service'
import { CreateRootBodyDto } from './dto/create-root.body.dto'
import { UpdateRootBodyDto } from './dto/update-root.body.dto'
import { GetDataListResDto } from './dto/get-data-list.res.dto'
import { GetDataFieldListResDto } from './dto/get-field-list.res.dto'
import { UpdateReferenceBodyDto } from './dto/update-reference.body.dto'
import { UploadDirectoryQueryDto } from './dto/upload-directory.query.dto'
import { UploadTableDataParamDto } from './dto/upload-table-data.param.dto'

@ApiTags('Data | 数据服务')
@Controller('data')
export class DataController {
  constructor(
    private readonly _dataSrv: DataService,
    private readonly _fileSrv: FileService,
  ) {}

  @ApiOperation({ summary: '创建一个根节点（数据大类）' })
  @HasPermission(PermissionType.DATA_ROOT_CREATE)
  @Put('root')
  public async createRoot(@Body() body: CreateRootBodyDto) {
    const { id, nameZH, nameEN, order } = body
    const root = new DataDirectory()
    root.id = id
    root.nameZH = nameZH
    root.nameEN = nameEN
    root.level = 0
    root.order = order ?? 0
    root.rootId = id
    await this._dataSrv.dirRepo().save(root)
    this._dataSrv.cacheDir()
    return root
  }

  @ApiOperation({ summary: '删除指定的根节点（数据大类）' })
  @HasPermission(PermissionType.DATA_ROOT_DELETE)
  @Delete('root/:dataRootId')
  public async deleteRoot(@Param() param: DataRootIdDto) {
    try {
      const deleteRes = await this._dataSrv.dirRepo().delete({ id: param.dataRootId })
      this._dataSrv.cacheDir()
      return deleteRes.affected
    }
    catch (e) {
      const sqlErr = parseSqlError(e)
      if (sqlErr === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.DATA_ROOT_CANNOT_DELETE_RELATED)
      responseError(ErrorCode.COMMON_UNEXPECTED_ERROR)
    }
  }

  @ApiOperation({ summary: '更新一个根节点（数据大类）的信息' })
  @HasPermission(PermissionType.DATA_ROOT_UPDATE)
  @Patch('root/:dataRootId')
  public async updateRoot(
    @Body() body: UpdateRootBodyDto,
    @Param() param: DataRootIdDto,
  ) {
    const allowedKeys: Array<keyof UpdateRootBodyDto> = ['nameZH', 'nameEN', 'order']
    if (allowedKeys.every(k => body[k] === undefined)) {
      responseParamsError([{
        property: 'body',
        constraints: { body: '至少需要一个参数' },
      }])
    }
    const updateRes = await this._dataSrv.dirRepo().update(
      { id: param.dataRootId },
      { ...objectPick(body, allowedKeys) },
    )
    this._dataSrv.cacheDir()
    return updateRes.affected
  }

  @ApiOperation({ summary: '获取所有的根节点（数据大类）数据' })
  @ApiSuccessResponse(GetDataListResDto)
  @DataRoleCheck('viewDirectories')
  @Get('root/list')
  public async getRoots(@Req() req: FastifyRequest) {
    const roots = await this._dataSrv.dirRepo().find({
      where: { parentId: IsNull() },
    })
    const dataRole = req.dataRole
    const allowedScopes = dataRole === '*'
      ? roots.map(r => r.id)
      : dataRole
        .viewDirectories
        .map(d => d.rootId)
    return createDataDirectoryTree(roots, allowedScopes, ['children', 'path', 'rootId', 'level', 'parentId'])
  }

  @ApiOperation({ summary: '上传中间表' })
  @HasPermission(PermissionType.DATA_UPLOAD)
  @ApiFormData()
  @Put('upload/:dataRootId')
  public async uploadDirectory(
    @Query() query: UploadDirectoryQueryDto,
    @Param() param: DataRootIdDto,
    @Body() body: any,
  ) {
    const buffer: Buffer = await body?.file?.toBuffer()

    // 判断文件是否为utf-8编码
    let str = buffer.toString()
    if (!isUTF8(buffer))
      str = iconv.decode(buffer, 'gbk')

    const csv = Papa.parse(str, { header: true }).data

    const { nodes, fields } = dataCsvParser(csv, param.dataRootId)

    const _ = console
    const logger = {
      log: (...msgs: any[]) => _.log('[上传中间表]', ...msgs),
      error: _.error,
    }

    const newIds = nodes.map(node => node.id)
    if (query.clear) {
      const where: FindOptionsWhere<DataDirectory> = {
        rootId: param.dataRootId,
        parentId: Not(IsNull()),
        id: Not(In(newIds)),
      }
      const deleteCount = await this._dataSrv.dirRepo().count({ where })
      logger.log(`clear ${deleteCount} rows`)
      await this._dataSrv.dirRepo().softDelete(where)
      logger.log('clear success')
    }
    try {
      await batchSave(this._dataSrv.dirRepo(), nodes, 'id', 1, true)
      await batchSave(this._dataSrv.fieldRepo(), fields, 'id')
      logger.log('upload success')
      this._dataSrv.cacheDir()
    }
    catch (e) {
      logger.error(e)
      logger.error('upload failed')
    }

    return {
      nodes: nodes.length,
      fields: fields.length,
    }
  }

  @ApiOperation({ summary: '获取指定分类的数据' })
  @ApiSuccessResponse(GetDataListResDto)
  @DataRoleCheck('viewDirectories')
  @Get('list/:dataRootId')
  public async getListOfDataRoot(
    @Param() param: DataRootIdDto,
    @Req() req: FastifyRequest,
  ) {
    const dataRole = req.dataRole
    const nodes = await this._dataSrv.dirRepo().find({
      where: { rootId: param.dataRootId },
    })

    const allowedScopes = dataRole === '*'
      ? [param.dataRootId]
      : dataRole
        .viewDirectories
        .map(d => d.id)
    return createDataDirectoryTree(nodes, allowedScopes)
  }

  @ApiOperation({ summary: '获取所有的数据资源（限管理用户权限使用）' })
  @ApiSuccessResponse(GetDataListResDto)
  @HasPermission([
    PermissionType.DATA_PERMISSION_QUERY,
    PermissionType.DATA_PERMISSION_ASSIGN_QUERY,
  ])
  @Get('list/all')
  public async getAllDataList() {
    const nodes = await this._dataSrv.dirRepo().find()
    return createDataDirectoryTree(nodes, nodes.map(v => v.id))
  }

  @ApiOperation({ summary: '更新引用规范' })
  @HasPermission(PermissionType.DATA_EDIT_REFERENCE)
  @Patch('reference/:dataDirectoryId')
  public async updateReference(
    @Param() param: DataDirectoryIdDto,
    @Body() body: UpdateReferenceBodyDto,
  ) {
    await this._dataSrv.dirRepo().update(
      { id: param.dataDirectoryId },
      { reference: body.reference },
    )
    return true
  }

  @ApiOperation({ summary: '获取指定表格的字段说明' })
  @ApiSuccessResponse(GetDataFieldListResDto)
  @DataRoleCheck('viewDirectories')
  @Get('fields/:dataDirectoryId')
  public async getFields(
    @Param() param: DataDirectoryIdDto,
    @Req() req: FastifyRequest,
  ) {
    const dataRole = req.dataRole
    const directory = await this._dataSrv.dirRepo().findOne({ where: { id: param.dataDirectoryId } })
    if (!directory)
      responseError(ErrorCode.DATA_DIRECTORY_NOT_FOUND)

    const allowed = dataRole === '*' || dataRole.viewDirectories.some(d => directory.path.includes(d.id))
    if (!allowed)
      responseError(ErrorCode.PERMISSION_DENIED)

    return await this._dataSrv.fieldRepo().find({
      where: { directoryId: param.dataDirectoryId },
      order: { order: 'ASC' },
    })
  }

  @ApiOperation({ summary: '获取数据预览' })
  @DataRoleCheck('viewDirectories')
  @Get('preview/:dataDirectoryId')
  public async previewData(
    @Param() param: DataDirectoryIdDto,
    @Req() req: FastifyRequest,
  ) {
    const dataDirectory = await this._dataSrv.dirRepo().findOne({ where: { id: param.dataDirectoryId } })
    const response = (code?: ErrorCode) => {
      this._dataSrv.saveLog({
        dataDirectory,
        action: LogDataAction.PREVIEW,
        status: code || 0,
        user: req.raw.user,
        ip: req.raw.ip,
      })
      code && responseError(code)
    }
    const dataRole = req.dataRole
    const dataRootId = dataDirectory?.rootId
    if (!dataDirectory)
      response(ErrorCode.DATA_DIRECTORY_NOT_FOUND)
    if (dataDirectory.level !== 4)
      response(ErrorCode.DATA_TABLE_MANIPULATE_ONLY)
    const allowed = dataRole === '*' || dataRole.viewDirectories.some(p => dataDirectory.path.includes(p.id))
    if (!allowed)
      response(ErrorCode.PERMISSION_DENIED)
    const tableEn = dataDirectory.nameEN
    const path = `preview/${dataRootId}/${tableEn}.csv`
    const readable = await this._fileSrv.download(MinioBucket.DATA, path)
    const buff = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      readable.on('data', chunk => chunks.push(chunk))
      readable.on('end', () => resolve(Buffer.concat(chunks)))
      readable.on('error', reject)
    })

    try {
      const data = Papa.parse(buff.toString(), { header: true }).data
      response()
      return data
    }
    catch (e) {
      response(ErrorCode.COMMON_UNEXPECTED_ERROR)
    }
  }

  @ApiOperation({
    summary: '上传表格 预览/下载 数据',
    description: '预览数据文件名为: `TABLE_ENG` + `.csv`；下载数据文件名为: `TABLE_ENG` + `.zip`',
  })
  @Throttle(10000, 60)
  @HasPermission(PermissionType.DATA_UPLOAD_TABLE)
  @ApiSuccessResponse(SuccessStringDto)
  @ApiFormData()
  @Put(':uploadType/:dataRootId/:filename')
  public async uploadTableData(
    @Param() param: UploadTableDataParamDto,
    @Body() body: any,
  ) {
    const buffer = await body?.file?.toBuffer()
    const { filename, dataRootId, uploadType } = param

    const arr = filename.split('.')
    const ext = arr.pop()
    if (
      (uploadType === UploadType.PREVIEW && ext !== 'csv')
      || (uploadType === UploadType.DOWNLOAD && ext !== 'zip')
    )
      responseError(ErrorCode.FILE_TYPE_NOT_ALLOWED)

    const name = arr.join('.')
    const saveFilename = `${name}.${ext}`
    const path = `${uploadType}/${dataRootId}/${saveFilename}`
    await this._fileSrv.upload(MinioBucket.DATA, path, buffer)
    return saveFilename
  }

  @ApiOperation({ summary: '获取数据下载链接' })
  @DataRoleCheck('downloadDirectories')
  @Get('download/link/:dataDirectoryId')
  public async getDownloadLink(
    @Param() param: DataDirectoryIdDto,
    @Req() req: FastifyRequest,
  ) {
    const dataDirectory = await this._dataSrv.dirRepo().findOne({ where: { id: param.dataDirectoryId } })
    const dataRole = req.dataRole
    const dataRootId = dataDirectory?.rootId

    const response = (code?: ErrorCode) => {
      this._dataSrv.saveLog({
        dataDirectory,
        action: LogDataAction.DOWNLOAD,
        status: code || 0,
        user: req.raw.user,
        ip: req.raw.ip,
      })
      code && responseError(code)
    }

    if (!dataDirectory)
      response(ErrorCode.DATA_DIRECTORY_NOT_FOUND)
    if (dataDirectory.level !== 4)
      response(ErrorCode.DATA_TABLE_MANIPULATE_ONLY)
    const allowed = dataRole === '*' || dataRole.downloadDirectories.some(p => dataDirectory.path.includes(p.id))
    if (!allowed)
      response(ErrorCode.PERMISSION_DENIED)
    const tableEn = dataDirectory.nameEN
    const path = `download/${dataRootId}/${tableEn}.zip`
    try {
      const url = await this._fileSrv.signUrl(MinioBucket.DATA, path)
      response()
      return url
    }
    catch (e) {
      if (e.message.match(/Not Found/))
        responseError(ErrorCode.FILE_NOT_FOUND)
      throw e
    }
  }
}
