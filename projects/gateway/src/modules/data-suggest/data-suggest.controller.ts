import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ErrorCode, PermissionType } from 'zjf-types'

import type { DataSuggestion } from 'src/entities/data-suggestion'
import { getQuery } from 'src/utils/query'
import { QueryDto } from 'src/dto/query.dto'
import { IsLogin } from 'src/guards/login.guard'
import { responseError } from 'src/utils/response'
import { HasPermission } from 'src/guards/permission.guard'
import { DataDirectoryIdDto } from 'src/dto/id/data-directory.dto'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { DataSuggestService } from './data-suggest.service'
import { CreateSuggestBodyDto } from './dto/create-suggest.body.dto'

@ApiTags('DataSuggest | 数据建议')
@Controller('data-suggest')
export class DataSuggestController {
  constructor(
    private readonly _dataSuggestSrv: DataSuggestService,
  ) {}

  @ApiOperation({ summary: '发起一个采购建议' })
  @IsLogin()
  @Put(':dataDirectoryId')
  public async create(
    @Param() param: DataDirectoryIdDto,
    @Body() body: CreateSuggestBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const { dataDirectoryId } = param
    try {
      const insertRes = await this._dataSuggestSrv.repo().insert({
        dataDirectoryId,
        reason: body.reason,
        userId: req.raw.user?.id,
      })
      return insertRes.identifiers[0].id
    }
    catch (e) {
      if (e.message.match(/FOREIGN\s+KEY\s+\(`dataDirectoryId`\)\s+REFERENCES/))
        responseError(ErrorCode.DATA_DIRECTORY_NOT_FOUND)
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.DATA_SUGGEST_DUPLICATED)

      responseError(ErrorCode.COMMON_UNEXPECTED_ERROR)
    }
  }

  @ApiOperation({ summary: '取消一个采购建议' })
  @IsLogin()
  @Delete(':dataDirectoryId')
  public async cancel(
    @Param() param: DataDirectoryIdDto,
    @Req() req: FastifyRequest,
  ) {
    const { dataDirectoryId } = param
    try {
      await this._dataSuggestSrv.repo().delete({
        userId: req.raw.user.id,
        dataDirectoryId,
      })
      return true
    }
    catch (e) {
      responseError(ErrorCode.COMMON_UNEXPECTED_ERROR)
    }
  }

  @ApiOperation({ summary: '查询一个采购建议' })
  @IsLogin()
  @Get(':dataDirectoryId')
  public async queryOne(
    @Param() param: DataDirectoryIdDto,
    @Req() req: FastifyRequest,
  ) {
    const { dataDirectoryId } = param
    return await this._dataSuggestSrv.repo().findOne({
      where: {
        userId: req.raw.user.id,
        dataDirectoryId,
      },
    })
  }

  @ApiOperation({
    summary: '查询采购建议（微观数据）',
    description: '一期的功能后端这边暂时不统计建议采购，可以前端自行做统计',
  })
  @HasPermission(PermissionType.DATA_SUGGEST_QUERY_ALL)
  @Post('query')
  public async query(@Body() body: QueryDto<DataSuggestion>) {
    return await getQuery(this._dataSuggestSrv.repo(), body || {})
  }
}
