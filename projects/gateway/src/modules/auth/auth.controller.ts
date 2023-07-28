import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { emailPhoneAtLeastOne } from 'src/utils/validator/email-phone-at-least-one'

import { AuthService } from './auth.service'
import { LoginSuccessResDto } from './dto/login-success.res.dto'
import { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto'

@ApiTags('Auth | 身份验证')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authSrv: AuthService) {}

  @ApiSuccessResponse(LoginSuccessResDto)
  @ApiOperation({ summary: '通过账号与密码登录' })
  @Post('login/password')
  public async login(@Body() body: LoginByPasswordBodyDto) {
    emailPhoneAtLeastOne(body)
    return await this._authSrv.loginByPassword(body)
  }
}
