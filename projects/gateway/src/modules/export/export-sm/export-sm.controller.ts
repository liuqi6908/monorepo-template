import { Body, Controller, Get, Param, Post, Put, Req, Res, StreamableFile } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ErrorCode, MinioBucket, PermissionType } from 'zjf-types'

import { getQuery } from 'src/utils/query'
import { QueryDto } from 'src/dto/query.dto'
import { IsLogin } from 'src/guards/login.guard'
import { responseError } from 'src/utils/response'
import { HasPermission } from 'src/guards/permission.guard'
import { FileService } from 'src/modules/file/file.service'
import { ApiFormData } from 'src/decorators/api/api-form-data'
import type { FileExportSmall } from 'src/entities/export/file-export-small.entity'
import { ExportService } from '../export.service'
import { ExportFileBodyDto } from '../dto/export-file.body.dto'

@ApiTags('ExportSm | 小文件外发')
@Controller('export-sm')
export class ExportSmController {
  constructor(
    private readonly _exportSrv: ExportService,
    private readonly _fileSrv: FileService,
  ) {}

  @ApiOperation({ summary: '发起小文件外发的申请' })
  @IsLogin()
  @ApiBody({ type: ExportFileBodyDto })
  @ApiFormData('file', { note: { type: 'string', description: '备注信息' } })
  @Put()
  public async exportSm(
    @Body() body: any,
    @Req() req: FastifyRequest,
  ) {
    const buffer = await body?.file?.toBuffer()
    if (!buffer)
      responseError(ErrorCode.EXPORT_FILE_NOT_EXISTS)
    const fileSize = buffer.length
    const filename = body?.file?.filename
    const contentType = body?.file?.mimetype
    const user = req.raw.user!
    const ip = req.raw.ip
    const note = body.note?.value

    return await this._exportSrv.exportSmall({
      user,
      ip,
      filename,
      fileSize,
      note,
      buffer,
      contentType,
    })
  }

  @ApiOperation({ summary: '查询自己的小文件外发历史记录' })
  @IsLogin()
  @Post('query/own')
  public async queryOwn(
    @Req() req: FastifyRequest,
    @Body() body: QueryDto<FileExportSmall>,
  ) {
    const user = req.raw.user!
    body = body ?? {}
    // 限制作用域
    body.filters = [...(body?.filters || [])].filter(cfg => cfg.field !== 'founderId')
    body.filters.push({ field: 'founderId', type: '=', value: user.id })
    return await getQuery(this._exportSrv.smRepo(), body || {})
  }

  @ApiOperation({ summary: '查询全部的小文件外发记录' })
  @HasPermission(PermissionType.EXPORT_SM_QUERY_ALL)
  @Post('query')
  public async queryAll(@Body() body: QueryDto<FileExportSmall>) {
    return await getQuery(this._exportSrv.smRepo(), body || {})
  }

  @ApiOperation({ summary: '下载小文件外发的附件' })
  @HasPermission(PermissionType.EXPORT_SM_QUERY_ALL)
  @ApiParam({ name: 'id', description: '小文件外发记录的唯一标识' })
  @Get('file/:id')
  public async downloadExportSmFile(
    @Res({ passthrough: true }) res: any,
    @Param('id') id: string,
  ) {
    const feSm = await this._exportSrv.smRepo().findOne({ where: { id } })
    if (!feSm?.path)
      responseError(ErrorCode.EXPORT_FILE_NOT_EXISTS)
    const readable = await this._fileSrv.download(MinioBucket.PRIVATE, feSm.path)
    res.header('Content-Disposition', `attachment; filename=${encodeURIComponent(feSm.fileName)}`)
    res.header('Content-Type', 'application/octet-stream')
    return new StreamableFile(readable)
  }

  @ApiOperation({ summary: '下载自己的小文件外发的附件' })
  @IsLogin()
  @ApiParam({ name: 'id', description: '小文件外发记录的唯一标识' })
  @Get('file/own/:id')
  public async downloadOwnExportSmFile(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: any,
    @Param('id') id: string,
  ) {
    const user = req.raw.user!
    const feSm = await this._exportSrv.smRepo().findOne({ where: { id } })
    if (!feSm)
      responseError(ErrorCode.EXPORT_FILE_NOT_EXISTS)
    if (feSm.founderId !== user.id)
      responseError(ErrorCode.PERMISSION_DENIED)
    return await this.downloadExportSmFile(res, id)
  }
}
