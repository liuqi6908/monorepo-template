import { objectOmit } from '@catsjuice/utils'
import { Throttle } from '@nestjs/throttler'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query, Req, forwardRef } from '@nestjs/common'
import { CodeAction, ErrorCode, PermissionType, PhoneCodeAction } from 'zjf-types'
import { In } from 'typeorm'

import type { SysAdmin } from 'src/config/_sa.config'
import type { User } from 'src/entities/user'
import type { UserIdDto } from 'src/dto/id/user.dto'
import { getQuery } from 'src/utils/query'
import { QueryDto } from 'src/dto/query.dto'
import { IsLogin } from 'src/guards/login.guard'
import { HasPermission } from 'src/guards/permission.guard'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { EmailCodeVerify } from 'src/guards/email-code-verify.guard'
import { PhoneCodeVerify } from 'src/guards/phone-code-verify.guard'
import { comparePassword } from 'src/utils/encrypt/encrypt-password'
import { ApiSuccessResponse, responseError } from 'src/utils/response'
import { UniversalOperationResDto } from 'src/dto/universal-operation.dto'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'
import { emailPhoneAtLeastOne } from 'src/utils/validator/email-phone-at-least-one'

import { AuthService } from '../auth/auth.service'
import { DesktopService } from '../desktop/desktop.service'
import { UserService } from './user.service'
import { UserProfileResponseDto } from './dto/user.res.dto'
import { CreateUserResDto } from './dto/create-user.res.dto'
import { CreateUserBodyDto } from './dto/create-user.body.dto'
import { GetProfileOwnQueryDto } from './dto/get-profile-own.query.dto'
import { UnbindEmailOwnBodyDto } from './dto/unbind-email-own.body.dto'
import { UnbindPhoneOwnBodyDto } from './dto/unbind-phone-own.body.dto'
import { UpdateEmailOwnBodyDto } from './dto/update-email-own.body.dto'
import { UpdatePhoneOwnBodyDto } from './dto/update-phone-own.body.dto'
import { UpdateProfileOwnBodyDto } from './dto/update-profile-own.body.dto'
import { UpdatePasswordByOldBodyDto } from './dto/update-pswd-by-old.body.dto'
import { UpdateUserRoleParamDto } from './dto/role/update-user-role.param.dto'
import { UpdatePasswordByEmailCodeBodyDto } from './dto/update-pswd-by-email-code.body.dto'
import { UpdatePasswordByPhoneCodeBodyDto } from './dto/update-pswd-by-phone-code.body.dto'
import { UpdateUserDataRoleParamDto } from './dto/role/update-user-data-role.param.dto'

@ApiTags('User | 用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly _userSrv: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly _authSrv: AuthService,
    private readonly _cfgSrv: ConfigService,
    private readonly _deskSrv: DesktopService,
  ) {}

  @ApiOperation({ summary: '创建一个新用户' })
  @ApiSuccessResponse(CreateUserResDto)
  @HasPermission(PermissionType.ACCOUNT_CREATE)
  @Put()
  public async createUser(@Body() body: CreateUserBodyDto) {
    emailPhoneAtLeastOne(body)
    return await this._userSrv.insertUser(body)
  }

  @ApiOperation({ summary: '批量停用用户' })
  @HasPermission(PermissionType.ACCOUNT_DELETE)
  @Delete()
  public async deleteUser(@Body() body: UserIdDto['userId'][]) {
    const desktop = await this._deskSrv.repo().find({
      where: {
        userId: In(body),
        disabled: false,
      },
    })
    if (body.length === 1 && desktop.length)
      responseError(ErrorCode.DESKTOP_REQUEST_IN_USE_EXISTS)

    const updateRes = await this._userSrv.qb()
      .update({ isDeleted: true })
      .where({
        id: In(body.filter(v => !desktop.map(d => d.userId).includes(v))),
      })
      .execute()
    return updateRes.affected
  }

  @ApiOperation({ summary: '批量恢复用户' })
  @HasPermission(PermissionType.ACCOUNT_UPDATE)
  @Patch()
  public async recoverUser(@Body() body: UserIdDto['userId'][]) {
    const updateRes = await this._userSrv.qb()
      .update(
        { isDeleted: false },
      )
      .where({ id: In(body) })
      .execute()
    return updateRes.affected
  }

  @ApiOperation({ summary: '获取当前登录用户的信息' })
  @ApiSuccessResponse(UserProfileResponseDto)
  @IsLogin()
  @Get('profile/own')
  public async getOwnProfile(
    @Query() query: GetProfileOwnQueryDto,
    @Req() req: FastifyRequest,
  ) {
    const omitFields: Array<keyof User> = ['isDeleted', 'isSysAdmin']
    if (!query.relation) {
      const user = objectOmit(
        (req.raw?.user || {}) as User, omitFields,
      )
      return {
        ...user,
        password: !!req.raw?.user.password,
      }
    }
    try {
      const user = objectOmit(
        await this._userSrv.findById(req.raw?.user?.id, {
          relations: query.relation as any,
        }), omitFields,
      )
      return {
        ...user,
        password: !!req.raw?.user.password,
      }
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.ENTITY_PROPERTY_NOT_FOUND) {
        responseParamsError([{
          property: 'relation',
          constraints: { relation: '关联信息有误' },
        }])
      }

      throw e
    }
  }

  @ApiOperation({ summary: '修改基本信息' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @Patch('own/profile')
  public async updateOwnProfile(
    @Body() body: UpdateProfileOwnBodyDto,
    @Req() req: FastifyRequest,
  ) {
    return await this._userSrv.updateUserBasicInfo(
      { id: req.raw?.user?.id },
      body,
    )
  }

  @ApiOperation({ summary: '解绑邮箱' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @EmailCodeVerify(CodeAction.UNBIND_EMAIL)
  @Delete('own/email')
  public async unbindOwnEmail(
    @Body() body: UnbindEmailOwnBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    const userEmail = user.email
    if (userEmail !== body.email)
      responseError(ErrorCode.USER_EMAIL_NOT_MATCHED)
    await this._userSrv.repo().update({ id: user.id }, { email: null })
    return true
  }

  @ApiOperation({ summary: '修改邮箱，简单处理，只要用户处于登录状态就可以修改邮箱，不需要校验原邮箱的权限，发送验证码到新的邮箱地址之后即可' })
  @EmailCodeVerify(CodeAction.BIND_EMAIL)
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @Patch('own/email')
  public async updateOwnEmail(
    @Body() body: UpdateEmailOwnBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    return await this._userSrv.updateUserEmail(user.id, body.email)
  }

  @ApiOperation({ summary: '解绑手机号' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @PhoneCodeVerify(PhoneCodeAction.UNBIND_PHONE)
  @Delete('own/phone')
  public async unbindOwnPhone(
    @Body() body: UnbindPhoneOwnBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    const userPhone = user.phone
    if (userPhone !== body.phone)
      responseError(ErrorCode.USER_PHONE_NUMBER_NOT_MATCHED)
    await this._userSrv.repo().update({ id: user.id }, { phone: null })
    return true
  }

  @ApiOperation({ summary: '修改手机号，简单处理，只要用户处于登录状态就可以修改手机号，不需要校验原手机号的权限，发送验证码到新的手机号之后即可' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @PhoneCodeVerify(PhoneCodeAction.BIND_PHONE)
  @Patch('own/phone')
  public async updateOwnPhone(
    @Body() body: UpdatePhoneOwnBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    return await this._userSrv.updateUserPhone(user.id, body.phone)
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '通过原密码修改密码（需要登录，账号未设置密码可直接修改）' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @Patch('own/password/old')
  public async updateOwnPasswordByOldPassword(
    @Body() body: UpdatePasswordByOldBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    const correct = await comparePassword(body.oldPassword || '', user.password || '')
    if (!!user.password && !correct)
      responseError(ErrorCode.AUTH_PASSWORD_NOT_MATCHED)
    await this._userSrv.updateUserPassword({ id: user.id }, body.newPassword)
    // 登出当前用户的所有登录会话
    // this._authSrv.logoutUser(user.id)
    return true
  }

  @ApiOperation({ summary: '通过邮箱验证码修改密码（不需要登录）' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @EmailCodeVerify(CodeAction.CHANGE_PASSWORD)
  @Patch('own/password/email')
  public async updateOwnPasswordByEmailCode(@Body() body: UpdatePasswordByEmailCodeBodyDto) {
    const { email, password } = body
    const user = await this._userSrv.repo().findOne({ where: { email } })
    if (!user)
      responseError(ErrorCode.AUTH_EMAIL_NOT_REGISTERED)
    await this._userSrv.updateUserPassword({ id: user.id }, password)
    // 登出当前用户的所有登录会话
    this._authSrv.logoutUser(user.id)
    return true
  }

  @ApiOperation({ summary: '通过手机验证码修改密码（不需要登录）' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @PhoneCodeVerify(PhoneCodeAction.CHANGE_PASSWORD)
  @Patch('own/password/phone')
  public async updateOwnPasswordByPhoneCode(@Body() body: UpdatePasswordByPhoneCodeBodyDto) {
    const { phone, password } = body
    const user = await this._userSrv.repo().findOne({ where: { phone } })
    if (!user)
      responseError(ErrorCode.AUTH_PHONE_NUMBER_NOT_REGISTERED)
    await this._userSrv.updateUserPassword({ id: user.id }, password)
    // 登出当前用户的所有登录会话
    this._authSrv.logoutUser(user.id)
    return true
  }

  @ApiOperation({ summary: '查询用户列表' })
  @HasPermission([
    PermissionType.ACCOUNT_QUERY,
    PermissionType.DATA_PERMISSION_ASSIGN_QUERY,
    PermissionType.ROLE_ASSIGN_QUERY,
  ])
  @Post('query')
  public async queryUserList(@Body() body: QueryDto<User>) {
    return await getQuery(this._userSrv.repo(), body || {})
  }

  @ApiOperation({ summary: '更新指定用户的角色' })
  @HasPermission(PermissionType.ACCOUNT_UPDATE_ROLE)
  @Patch(':userId/role/:roleId')
  public async updateUserRole(@Param() param: UpdateUserRoleParamDto) {
    const { userId } = param
    const roleId = param.roleId || null
    const { list } = this._cfgSrv.get<{ list: SysAdmin[] }>('sa')
    const user = await this._userSrv.repo().findOne({ where: { id: userId } })
    if (!user?.account)
      responseError(ErrorCode.USER_NOT_FOUND)
    if (list.some(v => v.account === user.account))
      responseError(ErrorCode.ROLE_UPDATE_ROOT_ROLE)

    try {
      return (await this._userSrv.repo().update({ id: userId }, { roleId })).affected
    }
    catch (e) {
      if (e.message.match(/FOREIGN KEY/)) {
        responseParamsError([{
          property: 'roleId',
          constraints: {
            roleName: '角色名不存在',
          },
        }])
      }
    }
  }

  @ApiOperation({ summary: '更新指定用户的数据角色' })
  @HasPermission(PermissionType.ACCOUNT_UPDATE_DATA_ROLE)
  @Patch(':userId/data-role/:dataRoleId')
  public async updateUserDataRole(
    @Param() param: UpdateUserDataRoleParamDto,
  ) {
    const { userId } = param
    const dataRoleId = param.dataRoleId || null
    try {
      return (await this._userSrv.repo().update({ id: userId }, { dataRoleId })).affected
    }
    catch (e) {
      if (e.message.match(/FOREIGN KEY/)) {
        responseParamsError([{
          property: 'dataRoleId',
          constraints: {
            dataRoleName: '数据角色不存在',
          },
        }])
      }
    }
  }

  @ApiOperation({ summary: '批量清空用户密码' })
  @HasPermission(PermissionType.ACCOUNT_DELETE_PASSWORD)
  @Delete('delete/password')
  public async batchDeleteUserPassword(@Body() body: UserIdDto['userId'][]) {
    const updateRes = await this._userSrv.qb()
      .update({ password: null })
      .where({ id: In(body) })
      .execute()

    return updateRes.affected
  }
}
