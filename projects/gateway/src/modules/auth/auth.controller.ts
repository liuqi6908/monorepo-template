import { ErrorCode } from 'zjf-types'
import * as svgCaptcha from 'svg-captcha'
import { Throttle } from '@nestjs/throttler'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common'

import { IsLogin } from 'src/guards/login.guard'
import { ApiErrorResponse, ApiSuccessResponse } from 'src/utils/response'
import { accountEmailPhoneAtLeastOne } from 'src/utils/validator/account-email-phone-at-least-one'

import { CodeService } from '../code/code.service'
import { JwtAuthService } from '../jwt-auth/jwt-auth.service'
import { AuthService } from './auth.service'
import { RegisterBodyDto } from './dto/register.body.dto'
import { LoginSuccessResDto } from './dto/login-success.res.dto'
import { LoginByEmailLinkDto } from './dto/login-by-email-link.body.dto'
import { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto'
import { LoginByEmailCodeBodyDto } from './dto/login-by-email-code.body.dto'

@ApiTags('Auth | 身份验证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authSrv: AuthService,
    private readonly _codeSrv: CodeService,
    private readonly _jwtAuthSrv: JwtAuthService,
  ) {}

  @ApiOperation({ summary: '通过 账号/邮箱/手机号码 + 密码 登录' })
  @ApiSuccessResponse(LoginSuccessResDto)
  @Post('login/password')
  public async loginByPassword(@Body() body: LoginByPasswordBodyDto, @Req() req: FastifyRequest) {
    accountEmailPhoneAtLeastOne(body)
    return await this._authSrv.loginByPassword(body, req.raw.ip)
  }

  @ApiOperation({ summary: '通过邮箱 + 验证码 登录' })
  @ApiSuccessResponse(LoginSuccessResDto)
  @Post('login/email/code')
  public async loginByEmailCode(@Body() body: LoginByEmailCodeBodyDto) {
    return await this._authSrv.loginByEmailCode(body)
  }

  @Throttle(1, 30)
  @ApiOperation({ summary: '通过邮箱魔法链接登录（半分钟内只能发送一次）' })
  @Post('login/email/link')
  public async loginByEmailLink(@Body() body: LoginByEmailLinkDto) {
    return await this._authSrv.loginByEmailLink(body)
  }

  @ApiOperation({ summary: '注册（邮箱+验证码）' })
  @ApiSuccessResponse(LoginSuccessResDto)
  @ApiErrorResponse(ErrorCode.AUTH_CODE_NOT_MATCHED)
  @Put('register')
  public async register(@Body() body: RegisterBodyDto) {
    return await this._authSrv.register(body)
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '获取图形验证码' })
  @Get('captcha')
  public async getCaptcha(@Req() req: FastifyRequest) {
    const ip = req.raw.ip
    const captcha = svgCaptcha.create({
      size: 6,
      width: 144,
      height: 48,
      noise: 3,
      fontSize: 48,
    })
    const { bizId } = await this._codeSrv.createCaptcha(ip, captcha.text)
    return {
      bizId,
      img: captcha.data,
    }
  }

  @ApiOperation({ summary: '登出' })
  @IsLogin()
  @Post('logout')
  public async logout(@Req() req: FastifyRequest) {
    await this._jwtAuthSrv.destroyLoginAuthToken(req.raw.token)
    return true
  }
}
